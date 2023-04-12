import {
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, inject,
    LangiumServices, LangiumSharedServices, Module, PartialLangiumServices
} from 'langium';
import { StrucTsGeneratedModule, StrucTsGeneratedSharedModule } from './generated/module';
import { StrucTsValidator, registerValidationChecks } from './struc-ts-validator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type StrucTsAddedServices = {
    validation: {
        StrucTsValidator: StrucTsValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type StrucTsServices = LangiumServices & StrucTsAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const StrucTsModule: Module<StrucTsServices, PartialLangiumServices & StrucTsAddedServices> = {
    validation: {
        StrucTsValidator: () => new StrucTsValidator()
    }
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
    shared: LangiumSharedServices,
    StrucTs: StrucTsServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        StrucTsGeneratedSharedModule
    );
    const StrucTs = inject(
        createDefaultModule({ shared }),
        StrucTsGeneratedModule,
        StrucTsModule
    );
    shared.ServiceRegistry.register(StrucTs);
    registerValidationChecks(StrucTs);
    return { shared, StrucTs };
}
