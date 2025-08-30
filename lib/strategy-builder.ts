import { randomUUID } from 'crypto';

export interface SectionDraft {
  title: string;
  content: string;
  citation?: string;
}

export interface BlueprintSection {
  title: string;
  content: string;
  citation: string;
}

export class StrategyBuilder {
  private sections: SectionDraft[] = [];

  addSection(section: SectionDraft) {
    this.sections.push(section);
  }

  build() {
    const blueprint: BlueprintSection[] = [];
    for (const s of this.sections) {
      if (!s.citation) {
        throw new Error(`Missing citation for section "${s.title}"`);
      }
      blueprint.push({
        title: s.title,
        content: s.content,
        citation: s.citation,
      });
    }
    return {
      analysisId: randomUUID(),
      blueprint,
    };
  }
}
