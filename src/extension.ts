import * as path from 'node:path';
import * as vscode from 'vscode';
import {
	LanguageClient, type LanguageClientOptions, type ServerOptions, TransportKind,
} from 'vscode-languageclient/node';
import { NodeFileSystem } from 'langium/node';
import { generateTSFile } from './cli/typescript_generator';
import { extractAstNode } from './cli/utils/cli-util';
import { type Model } from './language-server/generated/ast';
import { createStrucTsServices } from './language-server/struc-ts-module';

let client: LanguageClient;

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
	client = startLanguageClient(context);
	createStructsGenerationCommands(context);
}

// This function is called when the extension is deactivated.
export function deactivate(): Thenable<void> | undefined {
	if (client) {
		return client.stop();
	}

	return undefined;
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
	const serverModule = context.asAbsolutePath(path.join('out', 'language-server', 'main'));
	const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET ?? '6009'}`] };

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
	};

	const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.sts');
	context.subscriptions.push(fileSystemWatcher);

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'struc-ts' }],
		synchronize: {
			fileEvents: fileSystemWatcher,
		},
	};

	const client = new LanguageClient(
		'struc-ts',
		'StrucTS',
		serverOptions,
		clientOptions,
	);

	client.start().then(() => client).catch(async error => {
		console.error(error);
	});
	return client;
}

function createStructsGenerationCommands(context: vscode.ExtensionContext) {
	console.log('Creating StrucTS commands');
	const myCommandId = 'extension.generateTypeScript';
	context.subscriptions.push(
		vscode.commands.registerCommand(myCommandId, async (uri: vscode.Uri) => {
			const editor = vscode.window.activeTextEditor;
			if (!uri) {
				console.log('No uri provided');
				const documentUri = editor?.document.uri;
				if (documentUri) {
					uri = documentUri;
				}
			}

			if (uri) {
				console.log('Generating TypeScript file for ' + uri.fsPath);
				await generateTS(uri);
			}
		}),
	);
}

async function generateTS(uri: vscode.Uri): Promise<void> {
	if (uri.scheme === 'file') {
		const document = await vscode.workspace.openTextDocument(uri);
		if (document.languageId === 'struc-ts') {
			const services = createStrucTsServices(NodeFileSystem).StrucTs;
			const model = await extractAstNode<Model>(document.fileName, services);
			const destination = path.join(path.dirname(uri.fsPath), 'generated');
			generateTSFile(model, document.fileName, destination);
			await vscode.window.showInformationMessage('TypeScript File generated').then(() => {
				console.log('(WIP) Opening file: ' + document.fileName);
				// if (fs.existsSync(tsFile)) {
				// 	vscode.window.showTextDocument(vscode.Uri.file(tsFile));
				// }
			});
		} else {
			await vscode.window.showErrorMessage(
				'Failed! File needs to have the .sts extension',
			);
		}
	}
}
