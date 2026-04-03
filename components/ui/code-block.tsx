'use client';

import React, { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
}

// Simple token types
type TokenType = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'operator' | 'variable' | 'type' | 'plain';

interface Token {
  value: string;
  type: TokenType;
}

// Language-specific keywords
const KEYWORDS: Record<string, Set<string>> = {
  solidity: new Set(['pragma', 'solidity', 'contract', 'interface', 'library', 'function', 'modifier', 'event', 'struct', 'enum', 'mapping', 'address', 'uint', 'uint256', 'int', 'int256', 'bool', 'string', 'bytes', 'bytes32', 'public', 'private', 'internal', 'external', 'pure', 'view', 'payable', 'returns', 'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'new', 'delete', 'emit', 'require', 'assert', 'revert', 'throw', 'override', 'virtual', 'immutable', 'constant', 'memory', 'storage', 'calldata', 'constructor', 'fallback', 'receive', 'error', 'using', 'assembly', 'let', 'switch', 'case', 'default']),
  javascript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'typeof', 'instanceof', 'in', 'of', 'class', 'extends', 'super', 'this', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'yield', 'static', 'get', 'set']),
  typescript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'typeof', 'instanceof', 'in', 'of', 'class', 'extends', 'super', 'this', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'yield', 'static', 'get', 'set', 'interface', 'type', 'enum', 'namespace', 'declare', 'abstract', 'implements', 'readonly', 'keyof', 'as', 'is']),
  bash: new Set(['if', 'then', 'else', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return', 'exit', 'true', 'false', 'sudo', 'cd', 'ls', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'echo', 'export', 'source']),
  json: new Set(['true', 'false', 'null']),
};

const TYPES: Record<string, Set<string>> = {
  solidity: new Set(['address', 'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256', 'int', 'int256', 'bool', 'string', 'bytes', 'bytes1', 'bytes32', 'bytes4', 'msg', 'block', 'tx', 'abi']),
  typescript: new Set(['string', 'number', 'boolean', 'object', 'array', 'any', 'void', 'never', 'unknown', 'undefined', 'null', 'Promise', 'Record', 'Partial', 'Required', 'Pick', 'Omit', 'Map', 'Set']),
};

function tokenize(code: string, language: string): Token[] {
  const tokens: Token[] = [];
  const keywords = KEYWORDS[language] || KEYWORDS.javascript;
  const types = TYPES[language] || new Set();
  
  let remaining = code;
  
  while (remaining.length > 0) {
    // Single-line comments
    const commentMatch = remaining.match(/^(\/\/[^\n]*)/);
    if (commentMatch) {
      tokens.push({ value: commentMatch[1], type: 'comment' });
      remaining = remaining.slice(commentMatch[1].length);
      continue;
    }
    
    // Multi-line comments
    const multiCommentMatch = remaining.match(/^\/\*[\s\S]*?\*\//);
    if (multiCommentMatch) {
      tokens.push({ value: multiCommentMatch[0], type: 'comment' });
      remaining = remaining.slice(multiCommentMatch[0].length);
      continue;
    }
    
    // Strings (double quotes)
    const doubleStringMatch = remaining.match(/^"([^"\\]|\\.)*"/);
    if (doubleStringMatch) {
      tokens.push({ value: doubleStringMatch[0], type: 'string' });
      remaining = remaining.slice(doubleStringMatch[0].length);
      continue;
    }
    
    // Strings (single quotes)
    const singleStringMatch = remaining.match(/^'([^'\\]|\\.)*'/);
    if (singleStringMatch) {
      tokens.push({ value: singleStringMatch[0], type: 'string' });
      remaining = remaining.slice(singleStringMatch[0].length);
      continue;
    }
    
    // Template literals
    const templateMatch = remaining.match(/^`([^`\\]|\\.)*`/);
    if (templateMatch) {
      tokens.push({ value: templateMatch[0], type: 'string' });
      remaining = remaining.slice(templateMatch[0].length);
      continue;
    }
    
    // Numbers (including hex)
    const numberMatch = remaining.match(/^(0x[0-9a-fA-F]+|\d+\.?\d*(e[+-]?\d+)?)/);
    if (numberMatch) {
      tokens.push({ value: numberMatch[0], type: 'number' });
      remaining = remaining.slice(numberMatch[0].length);
      continue;
    }
    
    // Operators
    const operatorMatch = remaining.match(/^([+\-*/%=<>!&|^~?:]+|=>|===|!==|<=|>=|\.\.\.)/);
    if (operatorMatch) {
      tokens.push({ value: operatorMatch[0], type: 'operator' });
      remaining = remaining.slice(operatorMatch[0].length);
      continue;
    }
    
    // Identifiers (functions, keywords, types, variables)
    const identMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (identMatch) {
      const word = identMatch[1];
      let type: TokenType = 'variable';
      
      if (keywords.has(word)) {
        type = 'keyword';
      } else if (types.has(word)) {
        type = 'type';
      } else if (remaining.slice(identMatch[0].length).trimStart().startsWith('(')) {
        type = 'function';
      }
      
      tokens.push({ value: word, type });
      remaining = remaining.slice(identMatch[0].length);
      continue;
    }
    
    // Whitespace and other
    const otherMatch = remaining.match(/^(\s+|[{}()\[\];,.])/);
    if (otherMatch) {
      tokens.push({ value: otherMatch[0], type: 'plain' });
      remaining = remaining.slice(otherMatch[0].length);
      continue;
    }
    
    // Fallback: single character
    tokens.push({ value: remaining[0], type: 'plain' });
    remaining = remaining.slice(1);
  }
  
  return tokens;
}

function TokenizedCode({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={`syntax-${token.type}`}>
          {token.value}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({ code, language = 'javascript', showLineNumbers = true, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const tokens = tokenize(code, language);
  const lines = code.split('\n');
  
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);
  
  const languageLabels: Record<string, string> = {
    solidity: 'Solidity',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    bash: 'Bash',
    json: 'JSON',
  };
  
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card/80">
      {/* Header */}
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            {/* Window controls */}
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-warning/60" />
              <div className="size-3 rounded-full bg-success/60" />
            </div>
            {title && <span className="text-sm text-muted-foreground ml-2">{title}</span>}
          </div>
          <div className="flex items-center gap-2">
            {language && (
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-secondary/50">
                {languageLabels[language] || language}
              </span>
            )}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-secondary/50 transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="size-3.5 text-success" />
              ) : (
                <Copy className="size-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Code content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          {showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((_, lineIndex) => {
                  const lineTokens = tokenize(lines[lineIndex], language);
                  return (
                    <tr key={lineIndex} className="hover:bg-secondary/20">
                      <td className="pr-4 text-right select-none text-muted-foreground/40 text-xs w-10 border-r border-border/30">
                        {lineIndex + 1}
                      </td>
                      <td className="pl-4">
                        <TokenizedCode tokens={lineTokens} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <TokenizedCode tokens={tokens} />
          )}
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
