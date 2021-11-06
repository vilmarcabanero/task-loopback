import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

@authenticate('jwt')
export class TodoController {
  constructor(
    @repository(TodoRepository)
    public todoRepository: TodoRepository,
  ) {}

  @get('/todos')
  async getAllTodos(
    @param.filter(Todo) filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }

  @get('/todos/active')
  async getActiveTodos(): Promise<Todo[]> {
    return this.todoRepository.getActiveTodos();
  }

  @get('/todos/complete')
  async getCompleteTodos(): Promise<Todo[]> {
    return this.todoRepository.getCompleteTodos();
  }

  @get('/todos/{id}')
  async getTodo(@param.path.string('id') id: string): Promise<Todo> {
    return this.todoRepository.findById(id);
  }

  @post('/todos')
  async createTodo(@requestBody() todo: Todo): Promise<Todo> {
    return this.todoRepository.create(todo);
  }

  @patch('/todos/{id}')
  async updateTodo(
    @param.path.string('id') id: string,
    @requestBody() todo: {task: string},
  ): Promise<void> {
    await this.todoRepository.updateTodo(id, todo.task);
  }

  @patch('/todos/archive')
  async archiveCompleteTodolist(): Promise<Count> {
    return this.todoRepository.archiveCompleteTodolist();
  }

  @patch('/todos/complete/{id}')
  async makeComplete(@param.path.string('id') id: string): Promise<void> {
    await this.todoRepository.makeComplete(id);
  }

  @patch('/todos/incomplete/{id}')
  async makeIncomplete(@param.path.string('id') id: string): Promise<void> {
    await this.todoRepository.makeIncomplete(id);
  }

  @del('/todos/{id}')
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.todoRepository.deleteById(id);
  }
}
