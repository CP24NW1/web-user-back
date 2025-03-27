export class ExamDTO {
    constructor(data) {
      this.exam_id = data.exam_id;
      this.user_id = data.user_id;
      this.create_at = data.create_at;
      this.attempt_at = data.attempt_at;
      this.finish_at = data.finish_at;
      this.time_taken = data.time_taken;
      this.is_completed = data.is_completed;
    }
}

export class OptionDTO {
    constructor(data) {
      this.option_id = data.option_id;
      this.option_text = data.option_text;
      this.is_correct = data.is_correct;
    }
}
  

export class QuestionDTO {
    constructor(data) {
      this.exam_id = data.exam_id;
      this.finish_at = data.finish_at;
      this.question_id = data.question_id;
      this.skill_name = data.skill_name;
      this.question_text = data.question_text;
      this.selected_option_id = data.selected_option_id;
      this.options = data.options.map(option => new OptionDTO(option));
    }
}
