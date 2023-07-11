import {TodoListBase} from "todoPackage/TodoListBase";
import {TodoPackagePackage} from "todoPackage/TodoPackagePackage";
import {TaskImpl} from "todoPackage/TaskImpl";
import {TaskBase} from "todoPackage/TaskBase";
import {TodoListImpl} from "todoPackage/TodoListImpl";
import {EFactory} from "ecore/EFactory";
import {EPackageImpl} from "ecore/EPackageImpl";
import {EClass} from "ecore/EClass";
import {EAttribute} from "ecore/EAttribute";
import {EcorePackageImpl} from "ecore/EcorePackageImpl";
import {EOperation} from "ecore/EOperation";
import {EcoreFactoryImpl} from "ecore/EcoreFactoryImpl";
import {EReference} from "ecore/EReference";
export class TodoPackagePackageImpl extends EPackageImpl implements TodoPackagePackage{
		public static eNAME:string = "todoPackage";
		
		public static eNS_URI:string = "http://www.example.org/todo";
		
		public static eNS_PREFIX:string = "todo";
		
		
		
		/*
		constructor(){
			//no private constructors in TypeScript
			super(TodoPackagePackageImpl.eNS_URI, TodoPackageFactoryImpl.eINSTANCE as any as EFactory);
		}
		*/
		
		public static init():TodoPackagePackage
		{

	        // Obtain or create and register package
	        let theTodoPackagePackage = new TodoPackagePackageImpl();
	        theTodoPackagePackage.ecorePackage = EcorePackageImpl.eINSTANCE;
	        theTodoPackagePackage.ecoreFactory = EcoreFactoryImpl.eINSTANCE;
	
	        // Create package meta-data objects
	        theTodoPackagePackage.createPackageContents();
	
	        // Initialize created meta-data
	        theTodoPackagePackage.initializePackageContents();

	        return theTodoPackagePackage;
        }
        
        private isCreated:boolean = false;
        
        public createPackageContents = ():void =>
        {
            if (this.isCreated) return;
            this.isCreated = true;
			this.TodoListEClass = this.createEClass(TodoPackagePackageImpl.TODOLIST);
			TodoListBase.eStaticClass = this.TodoListEClass;
			this.createEAttribute(this.TodoListEClass, TodoPackagePackageImpl.TODO_LIST__NAME);
			this.createEReference(this.TodoListEClass, TodoPackagePackageImpl.TODO_LIST__TASKS);
			this.TaskEClass = this.createEClass(TodoPackagePackageImpl.TASK);
			TaskBase.eStaticClass = this.TaskEClass;
			this.createEAttribute(this.TaskEClass, TodoPackagePackageImpl.TASK__TITLE);
			this.createEAttribute(this.TaskEClass, TodoPackagePackageImpl.TASK__DESCRIPTION);
			this.createEAttribute(this.TaskEClass, TodoPackagePackageImpl.TASK__STATUS);
			this.createEAttribute(this.TaskEClass, TodoPackagePackageImpl.TASK__COMPLETED);
			this.createEReference(this.TaskEClass, TodoPackagePackageImpl.TASK__SUBTASKS);
			
			
        }
        private isInitialized:boolean = false;
        public initializePackageContents=():void =>
        {
            if (this.isInitialized) return;
            this.isInitialized = true;
            // Initialize package
            this.name = TodoPackagePackageImpl.eNAME;
            this.nsPrefix = TodoPackagePackageImpl.eNS_PREFIX;
            this.nsURI = TodoPackagePackageImpl.eNS_URI;

			
			
			var op:EOperation = null;
			
			this.initEClass(
			this.TodoListEClass,
			TodoListImpl, 
			"TodoList", 
			!EPackageImpl.IS_ABSTRACT, 
			!EPackageImpl.IS_INTERFACE, 
			EPackageImpl.IS_GENERATED_INSTANCE_CLASS);
			
			this.initEAttribute_EClassifier(
				this.getTodoList_Name(), 
				this.ecorePackage.getEString(), 
				"name", 
				null, 
				0, 
				1, 
				TodoListImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				!EPackageImpl.IS_UNSETTABLE, 
				!EPackageImpl.IS_ID, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			
			this.initEReference(
				this.getTodoList_Tasks(),
				this.getTask(), 
				null, 
				"tasks", 
				null, 
				1, 
				-1, 
				TodoListImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				EPackageImpl.IS_COMPOSITE, 
				EPackageImpl.IS_RESOLVE_PROXIES, 
				!EPackageImpl.IS_UNSETTABLE, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			
			
			
			this.initEClass(
			this.TaskEClass,
			TaskImpl, 
			"Task", 
			!EPackageImpl.IS_ABSTRACT, 
			!EPackageImpl.IS_INTERFACE, 
			EPackageImpl.IS_GENERATED_INSTANCE_CLASS);
			
			this.initEAttribute_EClassifier(
				this.getTask_Title(), 
				this.ecorePackage.getEString(), 
				"title", 
				null, 
				0, 
				1, 
				TaskImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				!EPackageImpl.IS_UNSETTABLE, 
				!EPackageImpl.IS_ID, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			this.initEAttribute_EClassifier(
				this.getTask_Description(), 
				this.ecorePackage.getEString(), 
				"description", 
				null, 
				0, 
				1, 
				TaskImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				!EPackageImpl.IS_UNSETTABLE, 
				!EPackageImpl.IS_ID, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			this.initEAttribute_EClassifier(
				this.getTask_Status(), 
				this.ecorePackage.getEString(), 
				"status", 
				null, 
				0, 
				1, 
				TaskImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				!EPackageImpl.IS_UNSETTABLE, 
				!EPackageImpl.IS_ID, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			this.initEAttribute_EClassifier(
				this.getTask_Completed(), 
				this.ecorePackage.getEBoolean(), 
				"completed", 
				"false", 
				0, 
				1, 
				TaskImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				!EPackageImpl.IS_UNSETTABLE, 
				!EPackageImpl.IS_ID, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			
			this.initEReference(
				this.getTask_Subtasks(),
				this.getTask(), 
				null, 
				"subtasks", 
				null, 
				0, 
				-1, 
				TaskImpl, 
				!EPackageImpl.IS_TRANSIENT, 
				!EPackageImpl.IS_VOLATILE, 
				EPackageImpl.IS_CHANGEABLE, 
				EPackageImpl.IS_COMPOSITE, 
				EPackageImpl.IS_RESOLVE_PROXIES, 
				!EPackageImpl.IS_UNSETTABLE, 
				EPackageImpl.IS_UNIQUE, 
				!EPackageImpl.IS_DERIVED, 
				EPackageImpl.IS_ORDERED);
			
			
			
			
        }
		
		
		private TodoListEClass:EClass = null;
		private TaskEClass:EClass = null;
		
		
		
		
		
		public static TODOLIST:number = 0;
		public static TODOLIST_FEATURE_COUNT:number = 2;
		public static TODOLIST_OPERATION_COUNT:number = 0;
		
		public static TODO_LIST__NAME:number = 0;
		public static TODO_LIST__TASKS:number = 1;
		
		public static TASK:number = 1;
		public static TASK_FEATURE_COUNT:number = 5;
		public static TASK_OPERATION_COUNT:number = 0;
		
		public static TASK__TITLE:number = 0;
		public static TASK__DESCRIPTION:number = 1;
		public static TASK__STATUS:number = 2;
		public static TASK__COMPLETED:number = 3;
		public static TASK__SUBTASKS:number = 4;
		
		
		/*Important: Call init() AFTER metaobject ids have been assigned.*/
		public static eINSTANCE:TodoPackagePackage = TodoPackagePackageImpl.init();
		
		
		public getTodoList=():EClass=>{return this.TodoListEClass;}
		
		public getTodoList_Name=():EAttribute=>{return <EAttribute> this.TodoListEClass.eStructuralFeatures.at(0);}
		public getTodoList_Tasks=():EReference=>{return <EReference> this.TodoListEClass.eStructuralFeatures.at(1);}
		public getTask=():EClass=>{return this.TaskEClass;}
		
		public getTask_Title=():EAttribute=>{return <EAttribute> this.TaskEClass.eStructuralFeatures.at(0);}
		public getTask_Description=():EAttribute=>{return <EAttribute> this.TaskEClass.eStructuralFeatures.at(1);}
		public getTask_Status=():EAttribute=>{return <EAttribute> this.TaskEClass.eStructuralFeatures.at(2);}
		public getTask_Completed=():EAttribute=>{return <EAttribute> this.TaskEClass.eStructuralFeatures.at(3);}
		public getTask_Subtasks=():EReference=>{return <EReference> this.TaskEClass.eStructuralFeatures.at(4);}
		
 
}
