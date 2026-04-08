import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { FileText, MessageSquare, TrendingUp, Upload, Zap } from "lucide-react";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { useChatSessions } from "../hooks/useChat";
import { useDocuments } from "../hooks/useDocuments";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "bg-card border-border hover:border-primary/30 transition-smooth",
        className,
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp className="h-3 w-3 text-accent" />
                <span className="text-xs text-accent font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: documents, isLoading: docsLoading } = useDocuments();
  const { data: sessions, isLoading: chatsLoading } = useChatSessions();

  const totalSize = documents?.reduce((acc, d) => acc + d.size, 0) ?? 0;
  const sizeMB = (totalSize / 1_048_576).toFixed(1);

  const recentDocs = documents?.slice(0, 3) ?? [];
  const recentChats = sessions?.slice(0, 3) ?? [];

  return (
    <div className="h-full overflow-auto bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your document intelligence overview
            </p>
          </div>
          <Button asChild size="sm" data-ocid="dashboard-upload-cta">
            <Link to="/home/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {docsLoading || chatsLoading ? (
            <>
              <SkeletonCard lines={2} />
              <SkeletonCard lines={2} />
              <SkeletonCard lines={2} />
            </>
          ) : (
            <>
              <StatCard
                title="Total Documents"
                value={documents?.length ?? 0}
                icon={FileText}
                trend="+2 this week"
              />
              <StatCard
                title="Storage Used"
                value={`${sizeMB} MB`}
                icon={Upload}
              />
              <StatCard
                title="Chat Sessions"
                value={sessions?.length ?? 0}
                icon={MessageSquare}
                trend="Active"
              />
            </>
          )}
        </div>

        {/* Recent documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-display font-semibold text-foreground">
              Recent Documents
            </h2>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary hover:text-primary"
            >
              <Link to="/home/documents">View all</Link>
            </Button>
          </div>

          {docsLoading ? (
            <div className="space-y-3">
              {["a", "b", "c"].map((k) => (
                <SkeletonCard key={k} lines={1} showAvatar />
              ))}
            </div>
          ) : recentDocs.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No documents uploaded yet
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="mt-2 text-primary"
                >
                  <Link to="/home/upload">Upload your first document</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-3.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-smooth group"
                  data-ocid="dashboard-doc-row"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <FileText
                      className="h-4.5 w-4.5 text-primary"
                      style={{ height: 18, width: 18 }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(doc.size / 1024).toFixed(0)} KB
                      {doc.pageCount ? ` · ${doc.pageCount} pages` : ""}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs hidden group-hover:flex"
                  >
                    PDF
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent chats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-display font-semibold text-foreground">
              Recent Conversations
            </h2>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-primary hover:text-primary"
            >
              <Link to="/home/chat">View all</Link>
            </Button>
          </div>

          {chatsLoading ? (
            <div className="space-y-3">
              {["a", "b"].map((k) => (
                <SkeletonCard key={k} lines={1} showAvatar />
              ))}
            </div>
          ) : recentChats.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No conversations yet
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="mt-2 text-primary"
                >
                  <Link to="/home/chat">Start a conversation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentChats.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-3.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-smooth"
                  data-ocid="dashboard-chat-row"
                >
                  <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {session.messageCount} messages
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-primary hover:text-primary text-xs"
                  >
                    <Link to="/home/chat">Continue</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Upload a document",
                icon: Upload,
                path: "/home/upload",
                desc: "PDF, DOCX, TXT",
              },
              {
                label: "Browse my docs",
                icon: FileText,
                path: "/home/documents",
                desc: "Search & manage",
              },
              {
                label: "Chat with AI",
                icon: MessageSquare,
                path: "/home/chat",
                desc: "Ask any question",
              },
            ].map(({ label, icon: Icon, path, desc }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border hover:border-primary/30 transition-smooth group"
                data-ocid="quick-action"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-smooth">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
