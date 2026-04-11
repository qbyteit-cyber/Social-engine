import { ExtractedContent, InputType } from '@/types/content'

export async function extractContent(
  type: InputType,
  input: string
): Promise<ExtractedContent> {
  switch (type) {
    case 'url':
      return extractFromUrl(input)
    case 'text':
      return extractFromText(input)
    case 'doc':
      return extractFromDoc(input)
    default:
      throw new Error(`Unsupported input type: ${type}`)
  }
}

async function extractFromUrl(url: string): Promise<ExtractedContent> {
  // Use Jina AI reader for clean content extraction
  const jinaUrl = `https://r.jina.ai/${url}`
  const res = await fetch(jinaUrl, {
    headers: { Accept: 'text/plain' },
  })
  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.statusText}`)
  const text = await res.text()
  return parseRawText(text)
}

async function extractFromText(text: string): Promise<ExtractedContent> {
  return parseRawText(text)
}

async function extractFromDoc(base64: string): Promise<ExtractedContent> {
  // Decode base64 and detect file type from magic bytes
  const buffer = Buffer.from(base64, 'base64')
  const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 // %P

  let text = ''
  if (isPdf) {
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    text = data.text
  } else {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    text = result.value
  }
  return parseRawText(text)
}

function parseRawText(text: string): ExtractedContent {
  const words = text.trim().split(/\s+/)
  return {
    title: words.slice(0, 10).join(' '),
    body: text.trim(),
    key_points: [],
    tone: 'neutral',
    word_count: words.length,
    estimated_read_time: Math.ceil(words.length / 200),
  }
}
