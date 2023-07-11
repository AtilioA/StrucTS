import {TodoPackagePackageImpl} from "todoPackage/TodoPackagePackageImpl";
import {TodoPackageFactory} from "todoPackage/TodoPackageFactory";
import {Task} from "todoPackage/Task";
import {TaskImpl} from "todoPackage/TaskImpl";
import {TodoListImpl} from "todoPackage/TodoListImpl";
import {TodoList} from "todoPackage/TodoList";
import {EFactoryImpl} from "ecore/EFactoryImpl";
import {EClass} from "ecore/EClass";
import {EObject} from "ecore/EObject";
export class TodoPackageFactoryImpl extends EFactoryImpl implements TodoPackageFactory{
	public static eINSTANCE : TodoPackageFactory = TodoPackageFactoryImpl.init();
	public static init() : TodoPackageFactory 
	{
		return new TodoPackageFactoryImpl();
	}
	
	public createTodoList = () : TodoList => {
		let theTodoList = new TodoListImpl();
		
		
		return theTodoList;
	}
	public createTask = () : Task => {
		let theTask = new TaskImpl();
		
		
		return theTask;
	}
	
	public create(eClass:EClass):EObject {
		switch (eClass.getClassifierID()) {
			case TodoPackagePackageImpl.TODOLIST: return this.createTodoList();
			case TodoPackagePackageImpl.TASK: return this.createTask();
			default:
				throw new Error("The class '" + eClass.name + "' is not a valid classifier");
		}
	}
	
	
	
}
