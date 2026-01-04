// import { NextRequest, NextResponse } from 'next/server';
// import Anthropic from '@anthropic-ai/sdk';
// import { supabase } from '@/lib/supabase';
// import type { UserProfile, Roadmap } from '@/types';
//
// const anthropic = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY,
// });
//
// export async function POST(req: NextRequest) {
//     try {
//         const profileData: UserProfile = await req.json();
//
//         // Generate roadmap using Claude
//         const roadmap = await generateRoadmap(profileData);
//
//         // Save profile to database
//         const { data: profile, error: profileError } = await supabase
//             .from('profiles')
//             .insert({
//                 current_role_title: profileData.current_role_title,
//                 years_experience: profileData.years_experience,
//                 target_role_title: profileData.target_role_title,
//                 location: profileData.location,
//                 background: profileData.background,
//             })
//             .select()
//             .single();
//
//         if (profileError) throw profileError;
//
//         // Save roadmap to database
//         const { data: savedRoadmap, error: roadmapError } = await supabase
//             .from('roadmaps')
//             .insert({
//                 user_id: profile.id,
//                 roadmap_data: roadmap,
//                 progress: 0,
//                 completed_items: [],
//             })
//             .select()
//             .single();
//
//         if (roadmapError) throw roadmapError;
//
//         return NextResponse.json({
//             success: true,
//             roadmapId: savedRoadmap.id,
//             profileId: profile.id,
//         });
//     } catch (error) {
//         console.error('Error generating roadmap:', error);
//         return NextResponse.json(
//             { error: 'Failed to generate roadmap' },
//             { status: 500 }
//         );
//     }
// }
//
// async function generateRoadmap(profile: UserProfile): Promise<Roadmap> {
//     const prompt = `You are an expert career coach specializing in tech transitions in Canada. Generate a detailed, personalized learning roadmap for someone transitioning from their current role to an AI/tech role.
//
// Current Profile:
// - Current Role: ${profile.current_role_title}
// - Years of Experience: ${profile.years_experience}
// - Target Role: ${profile.target_role_title}
// - Location: ${profile.location}
// - Current Skills: ${profile.background.skills.join(', ')}
// - Education: ${profile.background.education || 'Not specified'}
// - Industry: ${profile.background.industry || 'Not specified'}
// - Additional Context: ${profile.background.additional_info || 'None'}
//
// Create a comprehensive roadmap that:
// 1. Acknowledges their transferable skills and experience
// 2. Identifies specific skills gaps for the target role
// 3. Provides a realistic timeline (typically 3-6 months)
// 4. Includes practical projects they can build
// 5. Recommends Canadian-specific resources (courses, communities, job boards)
// 6. Considers the ${profile.location} job market
//
// Return the roadmap as a JSON object with this exact structure:
// {
//   "summary": "A 2-3 sentence overview of their transition path",
//   "totalWeeks": 16,
//   "phases": [
//     {
//       "name": "Foundation Phase",
//       "duration": "Weeks 1-4",
//       "focus": "What they'll learn in this phase"
//     }
//   ],
//   "items": [
//     {
//       "id": "unique-id-1",
//       "title": "Learn Python Fundamentals",
//       "description": "Detailed description of what to learn and why",
//       "category": "foundation",
//       "priority": "high",
//       "estimatedWeeks": 2,
//       "resources": [
//         {
//           "title": "Resource name",
//           "url": "https://example.com",
//           "type": "course",
//           "free": true
//         }
//       ]
//     }
//   ]
// }
//
// Make it specific, actionable, and encouraging. Include at least 12-15 roadmap items across all categories (foundation, technical, practical, career).`;
//
//     const message = await anthropic.messages.create({
//         model: 'claude-sonnet-4-20250514',
//         max_tokens: 4000,
//         messages: [
//             {
//                 role: 'user',
//                 content: prompt,
//             },
//         ],
//     });
//
//     const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
//
//     // Extract JSON from the response (Claude might wrap it in markdown)
//     const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//         throw new Error('Failed to parse roadmap from AI response');
//     }
//
//     const roadmap: Roadmap = JSON.parse(jsonMatch[0]);
//     return roadmap;
// }

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';
import type { UserProfile, Roadmap } from '@/types';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const profileData: UserProfile = await req.json();

        // Generate roadmap using Claude
        const roadmap = await generateRoadmap(profileData);

        // Save profile to database
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .insert({
                current_role_title: profileData.current_role_title,
                years_experience: profileData.years_experience,
                target_role_title: profileData.target_role_title,
                location: profileData.location,
                background: profileData.background,
            })
            .select()
            .single();

        if (profileError) throw profileError;

        // Save roadmap to database
        const { data: savedRoadmap, error: roadmapError } = await supabase
            .from('roadmaps')
            .insert({
                user_id: profile.id,
                roadmap_data: roadmap,
                progress: 0,
                completed_items: [],
            })
            .select()
            .single();

        if (roadmapError) throw roadmapError;

        return NextResponse.json({
            success: true,
            roadmapId: savedRoadmap.id,
            profileId: profile.id,
        });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        return NextResponse.json(
            { error: 'Failed to generate roadmap' },
            { status: 500 }
        );
    }
}

async function generateRoadmap(profile: UserProfile): Promise<Roadmap> {
    const prompt = `You are an expert career coach specializing in tech transitions in Canada. Generate a detailed, personalized learning roadmap for someone transitioning to their target role.

CRITICAL: Pay close attention to the TARGET ROLE and tailor the roadmap specifically for that role. Different roles require different skills:
- "Generative AI Developer" or "AI Application Developer" = Focus on using LLM APIs (OpenAI, Anthropic), prompt engineering, RAG, vector databases, building AI-powered apps
- "Machine Learning Engineer" = Focus on training models, MLOps, model deployment, frameworks like PyTorch/TensorFlow
- "Data Scientist" = Focus on statistics, data analysis, visualization, business insights
- "AI Research Engineer" = Focus on deep learning theory, research papers, implementing algorithms from scratch

Current Profile:
- Current Role: ${profile.current_role_title}
- Years of Experience: ${profile.years_experience}
- Target Role: ${profile.target_role_title}
- Location: ${profile.location}
- Current Skills: ${profile.background.skills.join(', ')}
- Education: ${profile.background.education || 'Not specified'}
- Industry: ${profile.background.industry || 'Not specified'}
- Additional Context: ${profile.background.additional_info || 'None'}

IMPORTANT CONTEXT:
- They have ${profile.years_experience}+ years as a ${profile.current_role_title}
- This means they already know: software development, APIs, databases, deployment, cloud services
- DO NOT teach them basic programming or web development
- Focus on what's NEW and specific to ${profile.target_role_title}

For someone targeting "${profile.target_role_title}" specifically:
1. Leverage their existing ${profile.current_role_title} skills (they can already build full applications)
2. Focus on AI-specific skills they need to ADD to their toolkit
3. Be practical and project-focused, not theoretical
4. Recommend tools and frameworks they'll actually use in ${profile.target_role_title} jobs
5. Include real-world projects they can build to demonstrate competency
6. Consider the ${profile.location} job market and what local companies are hiring for

If the target role involves Generative AI/LLMs:
- Focus on: LLM APIs, prompt engineering, RAG systems, vector databases, fine-tuning
- Skip: Training neural networks from scratch, deep learning theory, building transformers
- Projects: Chat applications, document Q&A systems, AI code assistants, content generators

If the target role involves traditional ML:
- Focus on: scikit-learn, model training, feature engineering, MLOps, model deployment
- Include: Some deep learning basics, but only if relevant to the role

Return the roadmap as a JSON object with this exact structure:
{
  "summary": "A 2-3 sentence overview acknowledging their current expertise and the specific path to ${profile.target_role_title}",
  "totalWeeks": 16,
  "phases": [
    {
      "name": "Phase name tailored to their journey",
      "duration": "Weeks X-Y",
      "focus": "Specific focus area for this phase"
    }
  ],
  "items": [
    {
      "id": "unique-id-1",
      "title": "Specific, actionable skill title",
      "description": "Detailed description explaining WHY this matters for ${profile.target_role_title} and HOW it builds on their existing skills",
      "category": "foundation" | "technical" | "practical" | "career",
      "priority": "high" | "medium" | "low",
      "estimatedWeeks": 2,
      "resources": [
        {
          "title": "Specific resource name",
          "url": "Real, working URL to the resource",
          "type": "course" | "article" | "video" | "book" | "tool",
          "free": true | false
        }
      ]
    }
  ]
}

RESOURCE GUIDELINES:
- Provide REAL, specific resources with actual URLs
- Prioritize free resources when possible
- Include Canadian-specific resources (Vector Institute, Mila, local meetups)
- Focus on practical, hands-on learning over pure theory
- Include official documentation for tools they'll use

RESOURCE QUALITY CHECKS:
- All URLs must be real, working links (not example.com)
- Prioritize free resources (80%+ should be free)
- Include specific Canadian institutions when relevant (Vector Institute, Mila, etc.)
- Avoid generic placeholder URLs

Make it specific, actionable, and encouraging. Include 12-15 roadmap items that are:
- Tailored to ${profile.target_role_title} specifically
- Practical and immediately applicable
- Building on their ${profile.current_role_title} experience
- Focused on filling the specific gap between current and target role`;

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

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from the response (Claude might wrap it in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse roadmap from AI response');
    }

    const roadmap: Roadmap = JSON.parse(jsonMatch[0]);
    return roadmap;
}