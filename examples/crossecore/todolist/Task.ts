import {Task} from "todoPackage/Task";
import {OrderedSet} from "ecore/OrderedSet";
import {InternalEObject} from "ecore/InternalEObject";

export interface Task
extends InternalEObject

{
	title:string;
	description:string;
	status:string;
	completed:boolean;
	
	subtasks: OrderedSet<Task>;
	

}

