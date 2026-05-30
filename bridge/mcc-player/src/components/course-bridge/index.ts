import CourseManage from './courseManager';
class Course {
  private static authManagerInstance: CourseManage | null = null;
  private constructor() {
  }
  public static getCourseManager(): CourseManage {
    if (!Course.authManagerInstance) {
        Course.authManagerInstance = new CourseManage();
    }
    return Course.authManagerInstance;
  }
  public static resetInsatance(): void {
    Course.authManagerInstance = null;
  }
}
export default Course;
