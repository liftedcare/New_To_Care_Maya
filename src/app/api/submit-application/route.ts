import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_CV_EXTS = ['pdf', 'docx']
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ALLOWED_IMMIGRATION = ['UK Citizen', 'Indefinite Leave to Remain', 'On a Visa']
const ALLOWED_DRIVING = ['No Driving Licence', 'Full UK Driving Licence', 'Provisional Licence']
const ALLOWED_GENDER = ['Prefer not to say', 'Male', 'Female', 'Non-binary', 'Other']
const ALLOWED_VISA_TYPES = ['Graduate', 'Student', 'Skilled worker', 'Health and social care', 'Other']

interface CvFilePayload {
  base64: string
  name: string
  type: string
}

interface ApplicationPayload {
  fullName: string
  mobileNumber: string
  email: string
  postcode: string
  genderIdentity: string
  immigrationStatus: string
  visaType?: string
  otherVisaDescription?: string
  drivingLicence: string
  cvFile?: CvFilePayload
}

export async function POST(request: NextRequest) {
  let body: ApplicationPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Strict allowlist validation — never trust client
  const failures: string[] = []
  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2 || body.fullName.length > 120) failures.push('fullName')
  if (!body.mobileNumber || typeof body.mobileNumber !== 'string' || body.mobileNumber.trim().length < 7 || body.mobileNumber.length > 30) failures.push('mobileNumber')
  if (!body.email || typeof body.email !== 'string' || !EMAIL_RE.test(body.email) || body.email.length > 254) failures.push('email')
  if (!body.postcode || typeof body.postcode !== 'string' || body.postcode.trim().length < 2 || body.postcode.length > 12) failures.push('postcode')
  if (!body.genderIdentity || !ALLOWED_GENDER.includes(body.genderIdentity)) failures.push('genderIdentity')
  if (!body.immigrationStatus || !ALLOWED_IMMIGRATION.includes(body.immigrationStatus)) failures.push('immigrationStatus')
  if (!body.drivingLicence || !ALLOWED_DRIVING.includes(body.drivingLicence)) failures.push('drivingLicence')

  if (body.immigrationStatus === 'On a Visa') {
    if (!body.visaType || !ALLOWED_VISA_TYPES.includes(body.visaType)) failures.push('visaType')
    if (body.visaType === 'Other' && (!body.otherVisaDescription || typeof body.otherVisaDescription !== 'string')) failures.push('otherVisaDescription')
  }

  if (failures.length > 0) {
    return NextResponse.json({ error: 'Invalid or missing fields', fields: failures }, { status: 400 })
  }

  // Clamp free-text fields
  if (body.otherVisaDescription && body.otherVisaDescription.length > 500) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const normalizedEmail = body.email.toLowerCase().trim()
  const normalizedMobile = body.mobileNumber.trim()

  // Duplicate check (email)
  const { data: emailDup } = await supabaseAdmin
    .from('applications')
    .select('id')
    .eq('email', normalizedEmail)
    .limit(1)
  if (emailDup && emailDup.length > 0) {
    return NextResponse.json({ error: 'duplicate', field: 'email' }, { status: 409 })
  }

  // Duplicate check (mobile)
  const { data: mobileDup } = await supabaseAdmin
    .from('applications')
    .select('id')
    .eq('mobile_number', normalizedMobile)
    .limit(1)
  if (mobileDup && mobileDup.length > 0) {
    return NextResponse.json({ error: 'duplicate', field: 'mobile' }, { status: 409 })
  }

  // CV file validation and upload
  let cvStoragePath: string | null = null

  if (body.cvFile?.base64) {
    const { base64, name: cvName, type: cvType } = body.cvFile

    if (typeof base64 !== 'string' || typeof cvName !== 'string' || typeof cvType !== 'string') {
      return NextResponse.json({ error: 'Invalid CV payload' }, { status: 400 })
    }

    const ext = cvName.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_CV_EXTS.includes(ext) || !ALLOWED_CV_TYPES.includes(cvType)) {
      return NextResponse.json({ error: 'Invalid CV file type. Upload a PDF or DOCX.' }, { status: 400 })
    }

    let buffer: Buffer
    try {
      buffer = Buffer.from(base64, 'base64')
    } catch {
      return NextResponse.json({ error: 'Invalid CV encoding' }, { status: 400 })
    }

    // Enforce size server-side (5MB max) — client pre-check is UI only
    if (buffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'CV exceeds 5MB limit' }, { status: 400 })
    }

    // Sanitise filename before storage
    const safeName = body.fullName.trim()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 60)
    const fileName = `${Date.now()}-${safeName}.${ext}`

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('cvs')
      .upload(fileName, buffer, { contentType: cvType, upsert: false })

    if (uploadError) {
      console.error('CV upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload CV' }, { status: 500 })
    }

    cvStoragePath = uploadData.path
  }

  // Stage is always computed server-side — client cannot influence this
  const stage: 'pass' = 'pass'

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('applications')
    .insert({
      full_name: body.fullName.trim(),
      mobile_number: normalizedMobile,
      email: normalizedEmail,
      postcode: body.postcode.trim().toUpperCase(),
      gender_identity: body.genderIdentity,
      immigration_status: body.immigrationStatus,
      visa_type: body.visaType ?? null,
      other_visa_description: body.otherVisaDescription ?? null,
      driving_licence: body.drivingLicence,
      cv_storage_path: cvStoragePath,
      stage,
    })
    .select('id')
    .single()

  if (insertError || !inserted) {
    console.error('Application insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }

  const secure = process.env.NODE_ENV === 'production'
  const response = NextResponse.json({ success: true, applicationId: inserted.id, stage })
  response.cookies.set('appSession', inserted.id, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7200,
    path: '/',
    secure,
  })
  return response
}
