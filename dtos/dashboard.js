export class ExamSummaryDTO {
    constructor(data) {
      this.exam_id = data.exam_id;
      this.test = data.test;
      this.skills = data.skills;
      this.score = data.score;
      this.total = data.total;
      this.percentage = data.percentage;
      this.submitted_date = data.submitted_date;
    }
}

export class GeneralStatsDTO {
    constructor(data) {
      this.total_exam_tested = data.total_exam_tested;
      this.total_questions = data.total_questions;
      this.score = data.score;
      this.total = data.total;
      this.average_score = data.average_score;
    }
}


export class SkillDTO {
    constructor(data) {
      this.skill_id = data.skill_id;
      this.skill_name = data.skill_name;
    }
}