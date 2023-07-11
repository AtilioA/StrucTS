import {EClass} from "ecore/EClass";
import {EAttribute} from "ecore/EAttribute";
import {EReference} from "ecore/EReference";
import {EPackage} from "ecore/EPackage";
export interface TodoPackagePackage extends EPackage {
	getTodoList():EClass;
	getTodoList_Tasks():EReference;
	
	getTodoList_Name():EAttribute;
	getTask():EClass;
	getTask_Subtasks():EReference;
	
	getTask_Title():EAttribute;
	getTask_Description():EAttribute;
	getTask_Status():EAttribute;
	getTask_Completed():EAttribute;
}
