import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { currentResume, jobDescription } = await req.json();

        if (!currentResume || !jobDescription) {
            return NextResponse.json(
                { error: 'Missing resume or job description' },
                { status: 400 }
            );
        }

        const optimizedResume = await optimizeResume(currentResume, jobDescription);

        return NextResponse.json({ optimizedResume });
    } catch (error) {
        console.error('Error optimizing resume:', error);
        return NextResponse.json(
            { error: 'Failed to optimize resume' },
            { status: 500 }
        );
    }
}

async function optimizeResume(
    currentResume: string,
    jobDescription: string
): Promise<string> {
    const prompt = `You are an expert resume writer and career coach specializing in tech and AI roles in Canada. Your task is to optimize a resume to match a specific job description while keeping all information truthful.

CURRENT RESUME:
${currentResume}

JOB DESCRIPTION:
${jobDescription}

OPTIMIZATION GUIDELINES:

1. **Keyword Optimization**
   - Identify key skills, tools, and technologies from the job description
   - Incorporate these naturally throughout the resume where the candidate has relevant experience
   - Use exact terminology from the job posting (e.g., if they say "LLMs" use "LLMs", not "Large Language Models")

2. **Achievement Enhancement**
   - Reframe accomplishments using the STAR method (Situation, Task, Action, Result)
   - Add metrics and quantifiable results wherever possible (%, $, numbers)
   - Highlight achievements that align with job requirements

3. **Skills Positioning**
   - Reorganize or emphasize skills that match job requirements
   - Group related skills together
   - Remove or de-emphasize less relevant skills

4. **Experience Description**
   - Rewrite bullet points to emphasize relevant responsibilities
   - Use strong action verbs (e.g., "Led", "Architected", "Implemented", "Optimized")
   - Match the tone and language style of the job description

5. **Canadian Context**
   - Use Canadian spelling (e.g., "organize" not "organize" if context is clearly Canadian)
   - Include location information appropriately
   - Consider Canadian industry standards

6. **Formatting**
   - Use a clean, ATS-friendly format
   - Keep sections clear: Contact, Summary, Experience, Skills, Education
   - Use consistent formatting throughout

CRITICAL RULES:
- ❌ DO NOT fabricate experience, skills, or achievements
- ❌ DO NOT add companies, roles, or projects that don't exist
- ❌ DO NOT exaggerate years of experience
- ✅ DO enhance and reframe existing experience
- ✅ DO use stronger language and better formatting
- ✅ DO highlight transferable skills
- ✅ DO quantify achievements where reasonable

OUTPUT FORMAT:
Return a complete, polished resume in plain text format that is ready to copy-paste or save. Use this structure:

[NAME]
[Contact Information]

PROFESSIONAL SUMMARY
[2-3 sentence compelling summary that highlights how their background aligns with the role]

EXPERIENCE
[Company Name] | [Role] | [Dates]
- [Achievement-focused bullet points with metrics]
- [Relevant responsibilities highlighting key skills from job description]

TECHNICAL SKILLS
[Organized by category, emphasizing skills from job description]

EDUCATION
[Degree] | [Institution] | [Year]

Now optimize the resume:`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    const optimizedResume =
        message.content[0].type === 'text' ? message.content[0].text : '';

    return optimizedResume;
}