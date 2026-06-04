import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export type AIProvider = 'claude' | 'openai';
export type GenerationMode = 'study-notes' | 'worksheet' | 'interview-qa' | 'bare-act-summary' | 'case-analysis' | 'comparative-analysis';
export type DepthLevel = 'beginner' | 'practitioner' | 'expert' | 'judicial';

interface GenerationRequest {
  subject: string;
  topic: string;
  mode: GenerationMode;
  depthLevel: DepthLevel;
  customTopic?: string;
}

interface GeneratedContent {
  content: string;
  metadata: {
    bareActSections?: string[];
    relatedCases?: string[];
    practicalInsights?: string[];
    keywords?: string[];
  };
}

const SYSTEM_PROMPTS = {
  'study-notes': `You are an expert legal educator specializing in Indian law. Generate comprehensive, well-structured study notes that include:
- Bare Act provisions with section numbers
- Landmark case laws with ratio and obiter
- Practical insights from a practicing lawyer's perspective
- Real-world applications and exceptions
- Key points for quick revision
Format: Use clear headings, numbered points, and bold important terms.`,

  'worksheet': `You are an expert legal examiner. Create a comprehensive practice worksheet with:
- 3-4 hypothetical scenarios (increasing difficulty)
- 5-7 short-answer questions with model answers
- 2-3 essay questions for deeper understanding
- Key points to remember
- References to relevant bare act sections
All answers must reflect a lawyer with 10+ years experience.`,

  'interview-qa': `You are preparing answers for an AI annotation specialist interview (Scale AI, Outlier, etc.). Provide:
- Expert-level Q&A format
- Answers reflecting 10+ years legal practice
- Practical examples from Indian jurisprudence
- Deep understanding of subtle legal nuances
- Reference to landmark judgments
- Real-world application scenarios
Be concise but comprehensive. Anticipate follow-up questions.`,

  'bare-act-summary': `You are a legal expert analyzing Indian statutes. Provide:
- Section-by-section analysis of the relevant bare act
- Purpose and object of each section
- Case law interpreting each section
- Practical application and exceptions
- Recent amendments (if applicable)
- Comparison with related acts
Structure: Use [Section X: Title] format for clarity.`,

  'case-analysis': `You are analyzing landmark Indian legal judgments. Provide:
- Case citation and basic facts
- Legal issues presented
- Ratio decidendi (binding principle)
- Obiter dicta (non-binding observations)
- Significance in Indian jurisprudence
- Practical implications
- Related cases and distinctions
Format: Use structured sections for clarity.`,

  'comparative-analysis': `You are comparing legal concepts across Indian laws. Provide:
- Side-by-side comparison of provisions
- Differences in scope and application
- When each applies (jurisdiction/substantive)
- Case law distinguishing the concepts
- Practical implications for lawyers
- Recent amendments and transitions
- Interview-relevant nuances
Use tables where appropriate for clarity.`
};

const DEPTH_INSTRUCTIONS = {
  'beginner': 'Keep language simple and definitions clear. Avoid advanced jurisprudence. Focus on basics.',
  'practitioner': 'Assume 8-10 years of legal practice. Include practical insights, case strategies, and real-world scenarios.',
  'expert': 'Advanced analysis with complex jurisprudence, subtle distinctions, and advanced case law interpretation.',
  'judicial': 'Judicial-level analysis suitable for High Court judge interviews. Deep constitutional and legal philosophy aspects.'
};

class AIService {
  private claudeClient: Anthropic | null = null;
  private openaiClient: OpenAI | null = null;
  private provider: AIProvider = 'claude';

  initialize() {
    const provider = (process.env.AI_PROVIDER as AIProvider) || 'claude';
    this.provider = provider;

    if (provider === 'claude') {
      const apiKey = process.env.CLAUDE_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ CLAUDE_API_KEY not set. Claude provider will fail.');
      } else {
        this.claudeClient = new Anthropic({ apiKey });
        console.log('✅ Claude API initialized');
      }
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ OPENAI_API_KEY not set. OpenAI provider will fail.');
      } else {
        this.openaiClient = new OpenAI({ apiKey });
        console.log('✅ OpenAI API initialized');
      }
    }
  }

  async generateContent(request: GenerationRequest): Promise<GeneratedContent> {
    const systemPrompt = SYSTEM_PROMPTS[request.mode];
    const depthInstruction = DEPTH_INSTRUCTIONS[request.depthLevel];

    const userPrompt = `
Subject: ${request.subject}
Topic: ${request.topic}
${request.customTopic ? `Custom Topic: ${request.customTopic}` : ''}
Depth Level: ${request.depthLevel}

Additional Instructions: ${depthInstruction}

Please generate comprehensive content for the "${request.mode}" mode based on the above parameters. 
For practitioner level, ensure practical insights reflect 8-10 years of legal practice.
For judicial level, ensure analysis is suitable for High Court judge-level understanding.
Focus on Indian law and Indian jurisprudence.
`;

    try {
      let content: string;

      if (this.provider === 'claude' && this.claudeClient) {
        content = await this.generateWithClaude(systemPrompt, userPrompt);
      } else if (this.provider === 'openai' && this.openaiClient) {
        content = await this.generateWithOpenAI(systemPrompt, userPrompt);
      } else {
        throw new Error(`AI Provider ${this.provider} not configured`);
      }

      return {
        content,
        metadata: this.extractMetadata(content, request)
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  private async generateWithClaude(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.claudeClient) {
      throw new Error('Claude client not initialized');
    }

    const message = await this.claudeClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const textBlock = message.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return textBlock.text;
  }

  private async generateWithOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    const textContent = response.choices[0].message.content;
    if (!textContent) {
      throw new Error('No text response from OpenAI');
    }

    return textContent;
  }

  private extractMetadata(content: string, request: GenerationRequest) {
    const metadata: any = {};

    // Extract Section references (e.g., "Section 304")
    const sectionMatches = content.match(/Section\s+(\d+[A-Z]*)/g) || [];
    if (sectionMatches.length > 0) {
      metadata.bareActSections = [...new Set(sectionMatches.slice(0, 10))];
    }

    // Extract case references (e.g., "AIR 2020 SC 123")
    const caseMatches = content.match(/\b[A-Za-z]+\s+\d{4}\s+[A-Za-z]+\s+\d+\b/g) || [];
    if (caseMatches.length > 0) {
      metadata.relatedCases = [...new Set(caseMatches.slice(0, 10))];
    }

    // Extract keywords
    const words = content.split(/\s+/).filter(word => word.length > 5);
    metadata.keywords = [...new Set(words.slice(0, 20))];

    // Add practical insights indicator
    if (request.depthLevel === 'practitioner' || request.depthLevel === 'expert') {
      metadata.practicalInsights = ['Based on ' + request.depthLevel + ' level analysis'];
    }

    return metadata;
  }

  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }
}

export const aiService = new AIService();
