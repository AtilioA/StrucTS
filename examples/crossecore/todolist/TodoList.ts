import {Task} from "todoPackage/Task";
import {OrderedSet} from "ecore/OrderedSet";
import {InternalEObject} from "ecore/InternalEObject";

export interface TodoList
extends InternalEObject

{
	name:string;
	
	tasks: OrderedSet<Task>;
	

}

