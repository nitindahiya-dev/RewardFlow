// src/pages/Tasks.tsx
import { useState } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, Card, CardHeader, CardTitle, CardBody, FormGroup, Label, PageContainer } from '../components/common';

const TasksContainer = styled(PageContainer)`
  max-width: 900px;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text};
`;

const TaskFormCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TasksList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TaskCard = styled(Card)`
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TaskDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TaskDate = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.span<{ completed: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, completed }) => (completed ? theme.colors.textSecondary : theme.colors.text)};
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
`;

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Sample Task',
      description: 'This is a sample task. You can edit or delete it.',
      completed: false,
      createdAt: new Date().toLocaleDateString(),
    },
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingTask
            ? { ...task, title: formData.title, description: formData.description }
            : task
        )
      );
      setEditingTask(null);
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        completed: false,
        createdAt: new Date().toLocaleDateString(),
      };
      setTasks([...tasks, newTask]);
    }
    setFormData({ title: '', description: '' });
    setShowForm(false);
    // TODO: Handle task creation/update with Redux
  };

  const handleEdit = (task: Task) => {
    setFormData({ title: task.title, description: task.description });
    setEditingTask(task.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    // TODO: Handle task deletion with Redux
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
    // TODO: Handle task completion toggle with Redux
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <TasksContainer>
      <TasksHeader>
        <PageTitle>My Tasks</PageTitle>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Task'}
        </Button>
      </TasksHeader>

      {showForm && (
        <TaskFormCard>
          <CardHeader>
            <CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                />
              </FormGroup>
              <Button type="submit">{editingTask ? 'Update Task' : 'Create Task'}</Button>
            </Form>
          </CardBody>
        </TaskFormCard>
      )}

      <TasksList>
        {tasks.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>No tasks yet</EmptyStateTitle>
            <p>Click "Add Task" to create your first task!</p>
          </EmptyState>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id}>
              <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskActions>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(task)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(task.id)}>
                    Delete
                  </Button>
                </TaskActions>
              </TaskHeader>
              <TaskDescription>{task.description}</TaskDescription>
              <TaskMeta>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />
                  <CheckboxLabel completed={task.completed}>
                    {task.completed ? 'Completed' : 'Mark as complete'}
                  </CheckboxLabel>
                </CheckboxWrapper>
                <TaskDate>Created: {task.createdAt}</TaskDate>
              </TaskMeta>
            </TaskCard>
          ))
        )}
      </TasksList>
    </TasksContainer>
  );
};



