import {Task} from "todoPackage/Task";
import {TodoPackagePackageLiterals} from "todoPackage/TodoPackagePackageLiterals";
import {OrderedSet} from "ecore/OrderedSet";
import {EClass} from "ecore/EClass";
import {NotificationChain} from "ecore/NotificationChain";
import {ENotificationImpl} from "ecore/ENotificationImpl";
import {NotificationImpl} from "ecore/NotificationImpl";
import {AbstractCollection} from "ecore/AbstractCollection";
import {InternalEObject} from "ecore/InternalEObject";
import {BasicEObjectImpl} from "ecore/BasicEObjectImpl";
		
			export class TaskBase
			extends BasicEObjectImpl
			implements Task
			{
				private _title:string = '';
				get title():string{
					return this._title;
				}
				set title(value:string){
					this._title = value; 
				}
				private _description:string = '';
				get description():string{
					return this._description;
				}
				set description(value:string){
					this._description = value; 
				}
				private _status:string = '';
				get status():string{
					return this._status;
				}
				set status(value:string){
					this._status = value; 
				}
				private _completed:boolean = false;
				get completed():boolean{
					return this._completed;
				}
				set completed(value:boolean){
					this._completed = value; 
				}
				private _subtasks:OrderedSet<Task> = null;
				
				get subtasks():OrderedSet<Task>{
					if(this._subtasks===null){
						this._subtasks = new OrderedSet<Task>(this, TodoPackagePackageLiterals.TASK__SUBTASKS, BasicEObjectImpl.EOPPOSITE_FEATURE_BASE - TodoPackagePackageLiterals.TASK__SUBTASKS);
							
					}
					return this._subtasks;
					
				}
				
				

			
				public static eStaticClass:EClass;
				
				protected eStaticClass():EClass{
					
					return TaskBase.eStaticClass;
				}
			
			
			
				public eGet_number_boolean_boolean(featureID:number, resolve:boolean, coreType:boolean):any{
					switch (featureID) {
						case TodoPackagePackageLiterals.TASK__TITLE:
							return this.title;
						case TodoPackagePackageLiterals.TASK__DESCRIPTION:
							return this.description;
						case TodoPackagePackageLiterals.TASK__STATUS:
							return this.status;
						case TodoPackagePackageLiterals.TASK__COMPLETED:
							return this.completed;
						case TodoPackagePackageLiterals.TASK__SUBTASKS:
							return this.subtasks;
					}
					//return this.eGetFromBasicEObjectImpl(featureID, resolve, coreType);
					return super.eGet(featureID, resolve, coreType);
				}
				
				public eSet_number_any(featureID:number, newValue:any):void {
					switch (featureID) {
						case TodoPackagePackageLiterals.TASK__TITLE:
							this.title = <string> newValue;
							return;
						case TodoPackagePackageLiterals.TASK__DESCRIPTION:
							this.description = <string> newValue;
							return;
						case TodoPackagePackageLiterals.TASK__STATUS:
							this.status = <string> newValue;
							return;
						case TodoPackagePackageLiterals.TASK__COMPLETED:
							this.completed = <boolean> newValue;
							return;
						case TodoPackagePackageLiterals.TASK__SUBTASKS:
							this.subtasks.clear();
							this.subtasks.addAll(newValue);
							return;
					}
					super.eSet_number_any(featureID, newValue);
				}

				
			}
			
