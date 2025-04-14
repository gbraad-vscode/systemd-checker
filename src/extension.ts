import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { exec, ExecException } from 'child_process';
import { Context } from './utils';

export async function activate(context: vscode.ExtensionContext) {
    await Context.set(false);
    
    if (os.platform() !== 'linux') {
        // Explicitly set false
        Context.set(false);
        return;
    }

    const checkIfRunning = async () => {
        
        exec('cat /proc/1/comm', (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                vscode.window.showErrorMessage(`Error checking systemd: ${stderr}`);
                return;
            }

            if (stdout.trim() === 'systemd') {
                Context.set(true);
                return;
            } else {
                // Explicitly set false
                Context.set(false);
                return;
            }
        });
    };

    await checkIfRunning();
}

export function deactivate() {
    Context.set(false);
}