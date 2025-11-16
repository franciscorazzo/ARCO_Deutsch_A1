import React from 'react';

export const ClassroomGuide: React.FC = () => {
    return (
        <div className="space-y-6 text-gray-700">
            <p>Para usar este aplicativo com seus alunos, você pode hospedá-lo gratuitamente na internet usando a Vercel e compartilhar o link no Google Classroom. Siga os passos abaixo:</p>

            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Parte 1: Publicando o App na Vercel</h3>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>
                        <strong>Baixe o Projeto:</strong> Primeiro, você precisa ter todos os arquivos deste aplicativo em seu computador. Se você está usando a ferramenta de desenvolvimento, procure por uma opção de "Download" ou "Exportar ZIP".
                    </li>
                    <li>
                        <strong>Descompacte os Arquivos:</strong> Após o download, você terá uma pasta com todos os arquivos (como `index.html`, `App.tsx`, etc.). Extraia o conteúdo do arquivo ZIP para uma pasta em seu computador.
                    </li>
                    <li>
                        <strong>Crie uma Conta na Vercel:</strong> Acesse <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</a> e crie uma conta gratuita. É recomendado usar sua conta do GitHub, GitLab ou Bitbucket para facilitar o processo.
                    </li>
                    <li>
                        <strong>Instale a Vercel CLI:</strong> Abra o terminal (ou Prompt de Comando/PowerShell no Windows) e instale a interface de linha de comando da Vercel com o comando: `npm install -g vercel`.
                    </li>
                    <li>
                        <strong>Faça Login na Vercel:</strong> No terminal, execute o comando `vercel login` e siga as instruções para autenticar sua conta.
                    </li>
                    <li>
                        <strong>Publique o Projeto:</strong> Navegue até a pasta do projeto no terminal usando o comando `cd` (ex: `cd caminho/para/sua/pasta`). Uma vez dentro da pasta, simplesmente execute o comando: `vercel`.
                    </li>
                     <li>
                        <strong>Siga as Instruções:</strong> A Vercel fará algumas perguntas. Você pode aceitar os padrões na maioria das vezes.
                        <ul className="list-disc list-inside pl-6 mt-1 text-sm">
                            <li>Set up and deploy? <strong>Y</strong></li>
                            <li>Which scope? <strong>(Seu nome de usuário)</strong></li>
                            <li>Link to existing project? <strong>N</strong></li>
                            <li>What's your project's name? <strong>(Pode ser `arco-deutsch-a1`)</strong></li>
                            <li>In which directory is your code located? <strong>./</strong> (pressione Enter)</li>
                            <li>A Vercel vai detectar que é um projeto Vite e perguntará se você quer sobrescrever as configurações. Responda <strong>N</strong>.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Copie o Link:</strong> Após o deploy, a Vercel fornecerá um link de produção (algo como `arco-deutsch-a1.vercel.app`). Este é o endereço do seu aplicativo. Copie este link!
                    </li>
                </ol>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Parte 2: Compartilhando no Google Classroom</h3>
                 <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li><strong>Acesse sua Turma:</strong> Abra o Google Classroom e vá para a turma com a qual você deseja compartilhar o aplicativo.</li>
                    <li><strong>Vá para "Atividades":</strong> Clique na aba "Atividades".</li>
                    <li><strong>Crie um Material:</strong> Clique em "Criar" e escolha "Material".</li>
                    <li><strong>Adicione o Link:</strong> Dê um título ao seu material (ex: "App de Progresso de Alemão") e clique em "Adicionar" &gt; "Link".</li>
                    <li><strong>Cole o Link da Vercel:</strong> Cole o link do seu site Vercel e clique em "Adicionar link".</li>
                    <li><strong>Poste o Material:</strong> Finalmente, clique em "Postar". Pronto!</li>
                </ol>
            </section>
            
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Dica Importante</p>
                <p>O progresso de cada aluno é salvo no navegador do dispositivo que ele está usando. Se um aluno trocar de computador, ele precisará usar as funções <strong>"Exportar JSON"</strong> para salvar seu progresso em um arquivo e <strong>"Importar JSON"</strong> no novo dispositivo para restaurá-lo.</p>
            </div>
        </div>
    );
};
