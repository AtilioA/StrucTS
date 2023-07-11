import {Task} from "todoPackage/Task";
import {TodoList} from "todoPackage/TodoList";
import {EFactory} from "ecore/EFactory";
export interface TodoPackageFactory extends EFactory{
	createTodoList():TodoList;
	createTask():Task;
}
