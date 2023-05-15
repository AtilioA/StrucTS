import {
	createDefaultModule,
	createDefaultSharedModule,
	type DefaultSharedModuleContext,
	inject,
	type LangiumServices,
	type LangiumSharedServices,
	type Module,
	type PartialLangiumServices,
} from 'langium';
import {
	StrucTsGeneratedModule,
	StrucTsGeneratedSharedModule,
} from './generated/module';
import { registerValidationChecks } from './struc-ts-validator';
import { StrucTSClassValidator } from './validators/class_validators';
import { StrucTSModelValidator } from './validators/model_validators';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type StrucTsAddedServices = {
	validation: {
		StrucTSModelValidator: StrucTSModelValidator;
		StrucTSClassValidator: StrucTSClassValidator;
	};
};

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type StrucTsServices = LangiumServices & StrucTsAddedServices;

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const StrucTsModule: Module<
StrucTsServices,
PartialLangiumServices & StrucTsAddedServices
> = {
	validation: {
		StrucTSModelValidator: () => new StrucTSModelValidator(),
		StrucTSClassValidator: () => new StrucTSClassValidator(),
	},
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createStrucTsServices(context: DefaultSharedModuleContext): {
	shared: LangiumSharedServices;
	StrucTs: StrucTsServices;
} {
	const shared = inject(
		createDefaultSharedModule(context),
		StrucTsGeneratedSharedModule,
	);
	const StrucTs = inject(
		createDefaultModule({ shared }),
		StrucTsGeneratedModule,
		StrucTsModule,
	);
	shared.ServiceRegistry.register(StrucTs);
	registerValidationChecks(StrucTs);
	return { shared, StrucTs };
}
