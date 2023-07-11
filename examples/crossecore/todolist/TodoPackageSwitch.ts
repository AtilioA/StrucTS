import {TodoPackagePackageImpl} from "todoPackage/TodoPackagePackageImpl";
import {Task} from "todoPackage/Task";
import {TodoPackagePackage} from "todoPackage/TodoPackagePackage";
import {TodoList} from "todoPackage/TodoList";
import {Switch} from "ecore/Switch";
import {EObject} from "ecore/EObject";
import {EPackage} from "ecore/EPackage";
export class TodoPackageSwitch<T> extends Switch<T> {
	protected static modelPackage:TodoPackagePackage;
	
	constructor(){
		super();
		if (TodoPackageSwitch.modelPackage == null) {
			TodoPackageSwitch.modelPackage = TodoPackagePackageImpl.eINSTANCE;
		}	
	}
	
	public isSwitchFor(ePackage:EPackage):boolean{
		return ePackage === TodoPackageSwitch.modelPackage;
	}
	
	public doSwitch3(classifierID:number, theEObject:EObject):T {
		switch (classifierID) {
			case TodoPackagePackageImpl.TODOLIST: {
				let obj:TodoList = <TodoList>theEObject;
				let result:T = this.caseTodoList(obj);
				if (result == null) result = this.defaultCase(theEObject);
				return result;
			}
			case TodoPackagePackageImpl.TASK: {
				let obj:Task = <Task>theEObject;
				let result:T = this.caseTask(obj);
				if (result == null) result = this.defaultCase(theEObject);
				return result;
			}
			default: return this.defaultCase(theEObject);
		}
	}
	
	
	public caseTodoList(object:TodoList):T {
		return null;
	}
	public caseTask(object:Task):T {
		return null;
	}
	
}

