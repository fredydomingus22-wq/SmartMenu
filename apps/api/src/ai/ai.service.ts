import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private model: ChatGoogleGenerativeAI;

  constructor() {
    // Note: API Key should be in process.env.GOOGLE_API_KEY
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro", 
      maxOutputTokens: 2048,
    });
  }

  /**
   * Simple chat completion wrapper
   */
  async getCompletion(prompt: string, systemPrompt?: string) {
    try {
      this.logger.log(`[AI] Processing completion request...`);
      
      const messages = [
        new SystemMessage(systemPrompt || "És o assistente inteligente do SmartMenu Angola. É competente, útil e focado em sucesso de restauração."),
        new HumanMessage(prompt),
      ];

      const parser = new StringOutputParser();
      const chain = this.model.pipe(parser);
      
      const response = await chain.invoke(messages);
      return response;
    } catch (error: any) {
      this.logger.error(`[AI] Error during completion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Placeholder for future Internal Workflows (Automation - Alex preference)
   */
  async analyzeSalesTrends(salesData: any) {
    this.logger.log(`[AI] Analyzing sales trends for automated insights...`);
    // Workflow logic goes here
    return "Análise pendente de volume de dados.";
  }
}
