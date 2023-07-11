import {Task} from "todoPackage/Task";
import {TodoPackagePackageLiterals} from "todoPackage/TodoPackagePackageLiterals";
import {TodoList} from "todoPackage/TodoList";
import {OrderedSet} from "ecore/OrderedSet";
import {EClass} from "ecore/EClass";
import {NotificationChain} from "ecore/NotificationChain";
import {ENotificationImpl} from "ecore/ENotificationImpl";
import {NotificationImpl} from "ecore/NotificationImpl";
import {AbstractCollection} from "ecore/AbstractCollection";
import {InternalEObject} from "ecore/InternalEObject";
import {BasicEObjectImpl} from "ecore/BasicEObjectImpl";
		
			export class TodoListBase
			extends BasicEObjectImpl
			implements TodoList
			{
				private _name:string = '';
				get name():string{
					return this._name;
				}
				set name(value:string){
					this._name = value; 
				}
				private _tasks:OrderedSet<Task> = null;
				
				get tasks():OrderedSet<Task>{
					if(this._tasks===null){
						this._tasks = new OrderedSet<Task>(this, TodoPackagePackageLiterals.TODO_LIST__TASKS, BasicEObjectImpl.EOPPOSITE_FEATURE_BASE - TodoPackagePackageLiterals.TODO_LIST__TASKS);
							
					}
					return this._tasks;
					
				}
				
				

			
				public static eStaticClass:EClass;
				
				protected eStaticClass():EClass{
					
					return TodoListBase.eStaticClass;
				}
			
			
			
				public eGet_number_boolean_boolean(featureID:number, resolve:boolean, coreType:boolean):any{
					switch (featureID) {
						case TodoPackagePackageLiterals.TODO_LIST__NAME:
							return this.name;
						case TodoPackagePackageLiterals.TODO_LIST__TASKS:
							return this.tasks;
					}
					//return this.eGetFromBasicEObjectImpl(featureID, resolve, coreType);
					return super.eGet(featureID, resolve, coreType);
				}
				
				public eSet_number_any(featureID:number, newValue:any):void {
					switch (featureID) {
						case TodoPackagePackageLiterals.TODO_LIST__NAME:
							this.name = <string> newValue;
							return;
						case TodoPackagePackageLiterals.TODO_LIST__TASKS:
							this.tasks.clear();
							this.tasks.addAll(newValue);
							return;
					}
					super.eSet_number_any(featureID, newValue);
				}

				
			}
			
