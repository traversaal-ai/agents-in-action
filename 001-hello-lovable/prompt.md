# Personal Task Tracker - Lovable Build Prompt

## Role
You are an expert frontend developer specializing in building clean, intuitive task management applications.

## Goal
Build a **Personal Task Tracker application** that allows users to organize their tasks by categories, mark them as complete, and filter their view based on categories.

## Application Requirements

### Core Features
#### 1. Add New Tasks
- Input field for task name
- Dropdown to select category (Work, Personal, Shopping)
- "Add Task" button to submit
#### 2. Task Display
- Show all tasks in a clean list format
- Display task name and category tag
- Include a checkbox to mark tasks as complete
- Completed tasks should have strikethrough text
- Include a delete button for each task
#### 3. Category Filtering
- Filter buttons: "All", "Work", "Personal", "Shopping"
- Active filter should be visually highlighted
- Task count should update based on active filter
#### 4. Task Counter
- Display total number of active (incomplete) tasks
- Update counter in real-time as tasks are added/completed/deleted

### User Flow
- User lands on the app and sees the task input form at the top
- User enters a task name and selects a category from dropdown
- User clicks "Add Task" - task appears in the list below
- User can filter tasks by clicking category buttons
- User can mark tasks complete by clicking the checkbox
- User can delete tasks by clicking the delete button

### Design Requirements
- Use a modern, clean design with good spacing
- Color-code categories (Work: blue, Personal: green, Shopping: purple)
- Use soft shadows for cards and buttons
- Ensure the interface is responsive and mobile-friendly
- Add smooth transitions for interactions (hover, complete, delete)

### Technical Specifications
- Store tasks in component state (no backend needed for this prototype)
- Each task should have: id, name, category, isCompleted
- Use React hooks (useState) for state management
- Implement filter logic to show/hide tasks based on selected category

### Output Constraints
- Single-page application
- No authentication required
- Data persists only during the session (resets on page refresh)
- Must be fully functional with no placeholders
- Clean, professional UI suitable for demonstration purposes

### Success Criteria
The application is successful when:
- Users can add tasks with categories without any errors
- Filter buttons correctly show/hide tasks based on category
- Task counter accurately reflects the number of incomplete tasks
- Completed tasks visually distinguish from active tasks
- Delete functionality removes tasks from the list
- The UI is clean, intuitive, and requires no instructions to use

## Example Workflow
1. User opens the app (empty state with input form visible)
2. User types "Finish presentation" and selects "Work" category
3. Clicks "Add Task" - task appears in the list with blue "Work" tag
4. User adds "Buy milk" with "Shopping" category - appears with purple tag
5. User clicks "Work" filter button - only work tasks show
6. User clicks "All" - both tasks show again
7. User checks the checkbox on "Buy milk" - text gets strikethrough, counter decreases
8. User clicks delete on "Buy milk" - task is removed from list

Start building this application now. Create a fully functional prototype with all the features described above.
