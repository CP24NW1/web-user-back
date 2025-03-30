export class UserDTO {
    constructor(data) {
      this.user_id = data.user_id;
      this.firstname = data.firstname;
      this.lastname = data.lastname;
      this.email = data.email;
      this.create_at = data.create_at;
      this.update_at = data.update_at;
      this.DOB = data.DOB
    }
}