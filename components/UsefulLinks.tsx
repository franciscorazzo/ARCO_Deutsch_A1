import React, { useState } from 'react';
import type { UsefulLink } from '../types';
import { LinkIcon, PlusIcon, TrashIcon } from './icons';

interface UsefulLinksProps {
    links: UsefulLink[];
    onAddLink: (title: string, url: string) => void;
    onDeleteLink: (id: string) => void;
}

export const UsefulLinks: React.FC<UsefulLinksProps> = ({ links, onAddLink, onDeleteLink }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    const handleAdd = () => {
        if (title.trim() && url.trim()) {
            // Basic URL validation
            try {
                new URL(url);
                onAddLink(title, url);
                setTitle('');
                setUrl('');
                setIsAdding(false);
            } catch (_) {
                alert('Por favor, insira um URL válido.');
            }
        } else {
            alert('Por favor, preencha o título e o URL.');
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <LinkIcon />
                    Meus Links Úteis
                </h2>
                {!isAdding && (
                     <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1 text-sm bg-gray-800 hover:bg-gray-900 text-white font-semibold py-1 px-2 rounded-md transition-colors"
                    >
                        <PlusIcon />
                        Adicionar
                    </button>
                )}
            </div>
            
            {isAdding && (
                <div className="p-3 bg-gray-50 rounded-md border space-y-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título (ex: Dicionário)"
                        className="w-full p-1.5 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://exemplo.com"
                        className="w-full p-1.5 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAdding(false)} className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-3 py-1">Cancelar</button>
                        <button onClick={handleAdd} className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md">Salvar</button>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {links.length > 0 ? (
                    links.map(link => (
                        <div key={link.id} className="group flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded-md">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium truncate"
                                title={link.url}
                            >
                                {link.title}
                            </a>
                            <button
                                onClick={() => onDeleteLink(link.id)}
                                className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Deletar link ${link.title}`}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Você ainda não adicionou nenhum link.</p>
                )}
            </div>
        </div>
    );
};