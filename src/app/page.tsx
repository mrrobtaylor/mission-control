'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  status: 'active' | 'idle' | 'offline';
  currentTask: string;
  lastActive: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'in_progress' | 'backlog' | 'done' | 'blocked';
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  projectId: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  number: string;
  title: string;
  excerpt: string;
  wordCount: number;
  status: 'draft' | 'idea' | 'published';
}

const AGENTS: Agent[] = [
  { id: 'barney', name: 'Barney', emoji: '🐾', status: 'active', currentTask: 'Deploying Mission Control', lastActive: 'Just now', color: '#22d3ee' },
  { id: 'fred', name: 'Fred', emoji: '🔨', status: 'idle', currentTask: 'Building blog templates', lastActive: '2 hours ago', color: '#f97316' },
  { id: 'wilma', name: 'Wilma', emoji: '✍️', status: 'idle', currentTask: 'Writing blog posts', lastActive: '2 hours ago', color: '#a78bfa' },
  { id: 'betty', name: 'Betty', emoji: '🔍', status: 'idle', currentTask: 'Researching blog ideas', lastActive: '2 hours ago', color: '#4ade80' },
];

const TASKS: Task[] = [
  { id: 'betty-ideas', title: 'Research 10 blog post ideas', description: 'Explore topics for the Bedrock blog', status: 'done', assignee: 'betty', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-1', title: 'Write blog post 1', description: 'Based on Betty\'s ideas', status: 'in_progress', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-2', title: 'Write blog post 2', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-3', title: 'Write blog post 3', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'fred-blog-templates', title: 'Build blog page templates', description: 'Create HTML/CSS blog templates', status: 'done', assignee: 'fred', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-4', title: 'Write blog post 4', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-5', title: 'Write blog post 5', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-6', title: 'Write blog post 6', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-7', title: 'Write blog post 7', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-8', title: 'Write blog post 8', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-9', title: 'Write blog post 9', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
  { id: 'wilma-post-10', title: 'Write blog post 10', description: 'Based on Betty\'s ideas', status: 'backlog', assignee: 'wilma', priority: 'high', projectId: 'bedrock-blog', updatedAt: '2026-06-08T00:03:00Z' },
];

const BLOG_POSTS: BlogPost[] = [
  { id: '01', number: '01', title: 'Why My Studio Is Called Bedrock', excerpt: 'The origin story — building on something solid, keeping things human, never taking yourself too seriously.', wordCount: 850, status: 'draft' },
  { id: '02', number: '02', title: 'The Night My Agent Killed the Gateway', excerpt: 'A postmortem of the 2026-06-07 outage — some infra bits should be left alone.', wordCount: 920, status: 'draft' },
  { id: '03', number: '03', title: 'The 10-Minute Rule', excerpt: 'Why every Bedrock task gets a 10-minute time limit — scope tight, ship often.', wordCount: 780, status: 'draft' },
  { id: '04', number: '04', title: 'How to Brief an AI Like You Brief a Junior Dev', excerpt: 'Context, examples, clear acceptance criteria — not a magic oracle.', wordCount: 1100, status: 'draft' },
  { id: '05', number: '05', title: 'Boring Infrastructure Is the Best Infrastructure', excerpt: 'A defence of the unglamorous stack — reliability beats novelty.', wordCount: 1050, status: 'draft' },
  { id: '06', number: '06', title: 'What Running a One-Person Studio in 2026 Looks Like', excerpt: 'Not the LinkedIn version — the real rhythms of shipping.', wordCount: 1200, status: 'draft' },
  { id: '07', number: '07', title: 'Three Things I Built This Month That Nobody Asked For', excerpt: 'Side projects, weird utilities, weekend experiments.', wordCount: 980, status: 'draft' },
  { id: '08', number: '08', title: 'Teaching an AI to Be Dry', excerpt: 'On voice, tone, and British humour for bots.', wordCount: 1150, status: 'draft' },
  { id: '09', number: '09', title: 'Telegram, Heartbeats, and Why I Talk to My Agent More Than My Team', excerpt: 'The weird intimacy of daily AI collaboration.', wordCount: 1020, status: 'draft' },
  { id: '10', number: '10', title: 'A Small Studio\'s Reading List (June 2026)', excerpt: 'Opinionated roundup of tools, posts, repos, and people.', wordCount: 680, status: 'idea' },
];

function AgentCard({ agent }: { agent: Agent }) {
  const statusClass = agent.status === 'active' ? 'agent-active' : agent.status === 'idle' ? 'status-idle' : 'status-offline';
  
  return (
    <div className="card" style={{ borderColor: agent.color + '40' }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{agent.emoji}</span>
        <div>
          <h3 className="font-semibold" style={{ color: agent.color }}>{agent.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`status-dot ${statusClass}`} />
            <span className="text-sm text-slate-400 capitalize">{agent.status}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-2">{agent.currentTask}</p>
      <p className="text-xs text-slate-500">Last active: {agent.lastActive}</p>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const agent = AGENTS.find(a => a.id === task.assignee);
  const statusColors: Record<string, string> = {
    in_progress: 'bg-cyan-500/20 text-cyan-400',
    backlog: 'bg-slate-500/20 text-slate-400',
    done: 'bg-green-500/20 text-green-400',
    blocked: 'bg-red-500/20 text-red-400',
  };
  
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-800 last:border-0">
      <span className="text-lg">{agent?.emoji || '❓'}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-200">{task.title}</p>
        <p className="text-xs text-slate-500">{task.description}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
        {task.status.replace('_', ' ')}
      </span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
        task.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
        'bg-slate-500/20 text-slate-400'
      }`}>
        {task.priority}
      </span>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-slate-500">#{post.number}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          post.status === 'draft' ? 'bg-amber-500/20 text-amber-400' :
          post.status === 'idea' ? 'bg-purple-500/20 text-purple-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {post.status}
        </span>
      </div>
      <h4 className="font-medium text-slate-200 mb-1">{post.title}</h4>
      <p className="text-xs text-slate-400 mb-2">{post.excerpt}</p>
      <p className="text-xs text-slate-600">{post.wordCount.toLocaleString()} words</p>
    </div>
  );
}

export default function MissionControl() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Mission Control</h1>
              <p className="text-slate-400">Bedrock Studio — Agent Operations Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">London Time</p>
              <p className="text-lg font-mono text-cyan-400">{time}</p>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">Active Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENTS.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Tasks — Bedrock Blog</h2>
            <div className="card">
              {TASKS.map(task => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Blog Posts</h2>
            <div className="space-y-3">
              {BLOG_POSTS.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center text-slate-600 text-sm">
          <p>Mission Control — Built by Barney, Fred, Wilma & Betty for Bedrock Studio</p>
        </footer>
      </div>
    </div>
  );
}