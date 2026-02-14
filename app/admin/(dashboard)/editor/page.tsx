"use client";
import React, { useState, useEffect } from "react";
import { uploadImage } from "@/app/actions/analytics";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Type,
  ImageIcon,
  Link2,
  Save,
  Upload,
  Trash2,
  Plus,
  Briefcase,
  Loader2,
  History,
  RotateCcw,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSiteContent, updateSiteContent, getSiteVersions, restoreVersion } from "@/app/actions/site-editor";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Tab = "textos" | "imagens" | "social" | "services" | "versions" | "contato";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "textos", label: "Textos", icon: Type },
  { id: "services", label: "Serviços", icon: Briefcase },
  { id: "imagens", label: "Portfólio", icon: ImageIcon },
  { id: "contato", label: "Contato", icon: Mail },
  { id: "social", label: "Redes", icon: Link2 },
  { id: "versions", label: "Histórico", icon: History },
];

/* Color Components Removed */


export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("textos");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const content = await getSiteContent();
    if (content) {
      setData(content);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSiteContent(data, note);
    setSaving(false);
    if (result.success) {
      toast.success("Alterações salvas com sucesso!");
      setNote("");
    } else {
      toast.error("Erro ao salvar alterações.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!loading && !saving && data) {
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, note, loading, saving]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-rose" /></div>;
  }

  if (!data) return <div>Erro ao carregar dados.</div>;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold text-ink">
            Editor do Site
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Edite o conteúdo e as cores do seu portfólio.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Input
              placeholder="Nota sobre esta versão (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-background/60"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "bg-rose hover:bg-rose/90 text-white font-bold",
              saving && "opacity-70 cursor-not-allowed"
            )}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-background/40 p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 px-4 font-sans text-sm font-bold transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-background text-ink shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "textos" && <TextosEditor data={data} setData={setData} />}
        {activeTab === "services" && <ServicesEditor data={data} setData={setData} />}
        {activeTab === "imagens" && <PortfolioEditor data={data} setData={setData} />}
        {activeTab === "contato" && <ContactEditor data={data} setData={setData} />}
        {activeTab === "social" && <SocialEditor data={data} setData={setData} />}
        {activeTab === "versions" && <VersionsHistory onRestore={(newData) => setData(newData)} />}
      </div>
    </div>
  );
}

/* ------ HELPER COMPONENTS ------ */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
      <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-ink">
        <span className="inline-block h-2 w-2 rounded-full bg-rose" />
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  )
}

function Field({ label, children, description }: { label: string; children: React.ReactNode, description?: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label className="font-sans text-xs font-bold text-ink/80 flex items-center gap-2">
        {label}
        {description && <span className="font-normal text-[10px] text-muted-foreground">({description})</span>}
      </label>
      {children}
    </div>
  )
}





/* ------ TEXTOS TAB ------ */
function TextosEditor({ data, setData }: { data: any; setData: any }) {

  const handleChange = (section: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...(data.about.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    setData((prev: any) => ({
      ...prev,
      about: {
        ...prev.about,
        stats: newStats
      }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Hero (Início)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Content */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">Textos Principais</h4>

            <Field label="Saudação">
              <Input value={data.hero.greeting} onChange={(e) => handleChange("hero", "greeting", e.target.value)} />
            </Field>

            <Field label="Título Principal">
              <Input value={data.hero.title} onChange={(e) => handleChange("hero", "title", e.target.value)} className="font-serif text-lg" />
            </Field>

            <Field label="Descrição">
              <Textarea value={data.hero.description} onChange={(e) => handleChange("hero", "description", e.target.value)} />
            </Field>
          </div>

          {/* Right Column - Buttons */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">Botões</h4>

            {/* CTA 1 */}
            <div className="p-4 rounded-lg bg-muted/20 border border-border flex flex-col gap-3">
              <span className="text-xs font-bold text-ink">Botão 1 (Portfólio)</span>
              <Field label="Texto do Botão">
                <Input value={data.hero.ctaPortfolio} onChange={(e) => handleChange("hero", "ctaPortfolio", e.target.value)} />
              </Field>
            </div>

            {/* CTA 2 */}
            <div className="p-4 rounded-lg bg-muted/20 border border-border flex flex-col gap-3">
              <span className="text-xs font-bold text-ink">Botão 2 (Contato - Borda)</span>
              <Field label="Texto do Botão">
                <Input value={data.hero.ctaContact} onChange={(e) => handleChange("hero", "ctaContact", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>
      </SectionCard>


      <SectionCard title="Sobre Mim">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">Conteúdo</h4>

            <Field label="Título (Script)">
              <Input value={data.about.title} onChange={(e) => handleChange("about", "title", e.target.value)} />
            </Field>

            <Field label="Subtítulo">
              <Input value={data.about.subtitle} onChange={(e) => handleChange("about", "subtitle", e.target.value)} className="font-serif" />
            </Field>

            <Field label="Descrição Completa">
              <Textarea value={data.about.description} onChange={(e) => handleChange("about", "description", e.target.value)} rows={5} />
            </Field>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estatísticas</h4>
              <div className="flex items-center gap-2">
                <Switch
                  id="show-stats"
                  checked={data.about.showStats !== false}
                  onCheckedChange={(checked) => setData((prev: any) => ({
                    ...prev,
                    about: { ...prev.about, showStats: checked }
                  }))}
                />
                <Label htmlFor="show-stats" className="text-xs font-bold text-ink/80 cursor-pointer">Exibir seção</Label>
              </div>
            </div>
            <div className={cn("flex flex-col gap-4 transition-opacity", data.about.showStats === false && "opacity-50")}>
              {(data.about.stats || []).map((stat: any, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-4 border p-3 rounded-lg bg-background">
                  <Field label={`Valor ${index + 1}`}>
                    <Input value={stat.value} onChange={(e) => handleStatChange(index, "value", e.target.value)} className="font-bold" />
                  </Field>
                  <Field label="Rótulo">
                    <Input value={stat.label} onChange={(e) => handleStatChange(index, "label", e.target.value)} />
                  </Field>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ------ SERVICES TAB ------ */
function ServicesEditor({ data, setData }: { data: any; setData: any }) {
  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...data.services.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData((prev: any) => ({
      ...prev,
      services: { ...prev.services, items: newItems }
    }));
  };

  const addItem = () => {
    const newItem = { title: "Novo Serviço", description: "Descrição do serviço", icon: "Palette" };
    setData((prev: any) => ({
      ...prev,
      services: { ...prev.services, items: [...prev.services.items, newItem] }
    }));
  };

  const removeItem = (index: number) => {
    const newItems = data.services.items.filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({
      ...prev,
      services: { ...prev.services, items: newItems }
    }));
  };

  const handleContentChange = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      services: {
        ...prev.services,
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Configuração da Seção">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
              <Field label="Título Principal">
                <Input value={data.services.title} onChange={(e) => handleContentChange("title", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
              <Field label="Subtítulo">
                <Input value={data.services.subtitle} onChange={(e) => handleContentChange("subtitle", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 bg-muted/20 rounded-lg border border-border">
            <div className="mt-auto flex justify-end">
              <Button onClick={addItem} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4" /> Adicionar Novo Serviço
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.services.items.map((item: any, index: number) => (
          <div key={index} className="relative rounded-xl border border-border bg-background p-6 flex flex-col gap-4">
            <button onClick={() => removeItem(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Título">
                <Input value={item.title} onChange={(e) => handleItemChange(index, "title", e.target.value)} className="font-bold" />
              </Field>
              <Field label="Ícone" description="Nome Lucide">
                <Input value={item.icon} onChange={(e) => handleItemChange(index, "icon", e.target.value)} />
              </Field>
            </div>
            <Field label="Descrição">
              <Textarea value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------ PORTFOLIO TAB ------ */

function ImageUploader({
  currentImage,
  onUploadComplete
}: {
  currentImage: string;
  onUploadComplete: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    if (result.success && result.url) {
      onUploadComplete(result.url);
      toast.success("Imagem enviada com sucesso!");
    } else {
      toast.error("Erro ao enviar imagem.");
    }
    setIsUploading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={currentImage || "/placeholder.svg"}
          alt="Preview"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg bg-rose px-4 py-2 font-sans text-sm font-bold text-white transition-all hover:opacity-90",
          isUploading && "opacity-70 cursor-wait"
        )}>
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? "Enviando..." : "Trocar Imagem"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        <p className="font-sans text-[10px] text-muted-foreground">
          Max 2MB. JPG, PNG.
        </p>
      </div>
    </div>
  );
}

function PortfolioEditor({ data, setData }: { data: any; setData: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    image: "/placeholder.svg"
  });

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...data.portfolio.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData((prev: any) => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: newItems }
    }));
  };

  const openNewProjectModal = () => {
    setNewProject({
      title: "",
      category: "",
      description: "",
      image: "/placeholder.svg"
    });
    setIsModalOpen(true);
  };

  const handleSaveNewProject = () => {
    if (!newProject.title) {
      toast.error("O título é obrigatório");
      return;
    }
    setData((prev: any) => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: [...prev.portfolio.items, newProject] }
    }));
    setIsModalOpen(false);
    toast.success("Projeto adicionado!");
  };

  const removeItem = (index: number) => {
    const newItems = data.portfolio.items.filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: newItems }
    }));
  };

  const handleContentChange = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Configuração da Seção">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
              <Field label="Título Principal">
                <Input value={data.portfolio.title} onChange={(e) => handleContentChange("title", e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
              <Field label="Subtítulo">
                <Input value={data.portfolio.subtitle} onChange={(e) => handleContentChange("subtitle", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 bg-muted/20 rounded-lg border border-border">
            <div className="mt-auto flex justify-end">
              <Button onClick={openNewProjectModal} size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-3.5 w-3.5" />
                Adicionar Projeto
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Imagem de Perfil (Sobre)">
        <div className="flex flex-col gap-2">
          <Field label="Foto de Perfil">
            <ImageUploader
              currentImage={data.about.image || ""}
              onUploadComplete={(url) => setData((prev: any) => ({ ...prev, about: { ...prev.about, image: url } }))}
            />
          </Field>
        </div>
      </SectionCard>

      <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-ink">
              <span className="inline-block h-2 w-2 rounded-full bg-moss" />
              Projetos do Portfólio
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {data.portfolio.items.map((item: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-background p-4 flex flex-col gap-4"
            >
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <Field label="Título">
                  <Input value={item.title} onChange={(e) => handleItemChange(index, "title", e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Categoria">
                    <Input value={item.category} onChange={(e) => handleItemChange(index, "category", e.target.value)} />
                  </Field>
                  <Field label="ID/Link">
                    <Input value={item.id} onChange={(e) => handleItemChange(index, "id", e.target.value)} />
                  </Field>
                </div>
                <Field label="Descrição">
                  <Textarea value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} rows={2} />
                </Field>
                <Field label="Upload">
                  <ImageUploader
                    currentImage={item.image}
                    onUploadComplete={(url) => handleItemChange(index, "image", url)}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field label="Título">
              <Input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Ex: Branding Café" />
            </Field>
            <Field label="Categoria">
              <Input value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} placeholder="Ex: Identidade Visual" />
            </Field>
            <Field label="Descrição">
              <Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Breve descrição..." />
            </Field>
            <Field label="Imagem">
              <ImageUploader currentImage={newProject.image} onUploadComplete={(url) => setNewProject({ ...newProject, image: url })} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNewProject} className="bg-rose text-white hover:bg-rose/90">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------ CONTACT TAB ------ */
function ContactEditor({ data, setData }: { data: any; setData: any }) {
  const handleChange = (field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      contact: {
        ...(prev.contact || {}),
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Cabeçalho da Seção">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <Field label="Subtítulo (Script)">
              <Input
                value={data.contact?.subtitle || "Vamos conversar"}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Ex: Vamos conversar"
              />
            </Field>
            <Field label="Título Principal">
              <Input
                value={data.contact?.title || "Pronta para transformar sua presença digital?"}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ex: Pronta para transformar..."
              />
            </Field>
          </div>
          <Field label="Descrição">
            <Textarea
              value={data.contact?.description || "Entre em contato e vamos criar juntas uma estratégia única para a sua marca. Cada projeto é uma nova oportunidade de conexão."}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              placeholder="Descrição da seção..."
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Informações de Contato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Email">
            <Input
              value={data.contact?.email || "contato@seudominio.com"}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contato@exemplo.com"
            />
          </Field>
          <Field label="Instagram (Ex: @seuperfil)">
            <Input
              value={data.contact?.instagram || "@seuperfil"}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="@seu.perfil"
            />
          </Field>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 mt-2">
            <Field label="WhatsApp (Texto do Botão)">
              <Input
                value={data.contact?.whatsapp || "Solicitar Orçamento"}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="Ex: Solicitar Orçamento"
              />
            </Field>
            <Field label="WhatsApp (Número/Link)">
              <Input
                value={data.contact?.whatsappNumber || "5500000000000"}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                placeholder="Ex: 5511999999999 (apenas números)"
              />
            </Field>
          </div>

          <div className="col-span-1 md:col-span-2 border-t pt-4">
            <Field label="WhatsApp (Mensagem Automática ao Clicar)">
              <Input
                value={data.contact?.whatsappMessage || "Olá Ana! Vi seu portfólio e gostaria de solicitar um orçamento."}
                onChange={(e) => handleChange("whatsappMessage", e.target.value)}
                placeholder="Ex: Olá, gostaria de saber mais..."
              />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Configuração do Formulário">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Título do Formulário">
            <Input
              value={data.contact?.formTitle || "Envie uma mensagem"}
              onChange={(e) => handleChange("formTitle", e.target.value)}
              placeholder="Ex: Envie uma mensagem"
            />
          </Field>
          <Field label="Subtítulo do Formulário">
            <Input
              value={data.contact?.formSubtitle || "Preencha o formulário abaixo e entrarei em contato em breve."}
              onChange={(e) => handleChange("formSubtitle", e.target.value)}
              placeholder="Ex: Preencha o formulário abaixo..."
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

/* ------ SOCIAL TAB ------ */
function SocialEditor({ data, setData }: { data: any; setData: any }) {

  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...(data.social.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setData((prev: any) => ({
      ...prev,
      social: { ...prev.social, links: newLinks }
    }));
  };

  const addLink = () => {
    const newLink = { platform: "Nova Rede", url: "https://", color: "rose" };
    setData((prev: any) => ({
      ...prev,
      social: { ...prev.social, links: [...(prev.social.links || []), newLink] }
    }));
  };

  const removeLink = (index: number) => {
    const newLinks = (data.social.links || []).filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({
      ...prev,
      social: { ...prev.social, links: newLinks }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-ink">
            <span className="inline-block h-2 w-2 rounded-full bg-rose" />
            Links das Redes Sociais
          </h3>
          <Button onClick={addLink} size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4" /> Adicionar Rede
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {(data.social.links || []).length === 0 && (
            <p className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
              Nenhuma rede social adicionada.
            </p>
          )}

          {(data.social.links || []).map((link: any, index: number) => (
            <div key={index} className="relative flex flex-col gap-4 border p-4 rounded-lg bg-background group">
              <button
                onClick={() => removeLink(index)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors p-1"
                title="Excluir rede social"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                <Field label="Plataforma">
                  <Input
                    value={link.platform || ""}
                    onChange={(e) => handleLinkChange(index, "platform", e.target.value)}
                    placeholder="Ex: Instagram"
                  />
                </Field>
                <Field label="URL">
                  <Input
                    value={link.url || ""}
                    onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}

/* ------ DESIGN TAB ------ */
/* DesignEditor removed */


/* ------ VERSIONS TAB ------ */
import { deleteVersion } from "@/app/actions/site-editor";

function VersionsHistory({ onRestore }: { onRestore: (data: any) => void }) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [diffDialog, setDiffDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    setLoading(true);
    const data = await getSiteVersions();
    setVersions(data);
    setLoading(false);
  };

  const handleDelete = async (v: any) => {
    if (confirm("Tem certeza que deseja excluir esta versão do histórico?")) {
      const result = await deleteVersion(v.id);
      if (result.success) {
        toast.success("Versão excluída.");
        setVersions(prev => prev.filter(item => item.id !== v.id));
      } else {
        toast.error("Erro ao excluir versão.");
      }
    }
  };

  const handleRestore = async (v: any) => {
    if (confirm("Deseja realmente restaurar esta versão? As alterações atuais não salvas serão perdidas.")) {
      const result = await restoreVersion(v.id);
      if (result.success) {
        toast.success("Versão restaurada com sucesso!");
        onRestore(v.content);
      } else {
        toast.error("Erro ao restaurar versão.");
      }
    }
  };

  const openDiff = (v: any) => {
    setSelectedVersion(v);
    setDiffDialog(true);
  };

  // Helper to identify changed sections
  const getChangedSections = (current: any, previous: any) => {
    if (!previous) return ["Backup Inicial"];
    const sections = [];
    const map: Record<string, string> = {
      hero: "Início (Hero)",
      about: "Sobre Mim",
      services: "Serviços",
      portfolio: "Portfólio",
      contact: "Contato",
      social: "Redes Sociais",
      theme: "Tema/Cores"
    };

    for (const key of Object.keys(map)) {
      if (JSON.stringify(current[key]) !== JSON.stringify(previous[key])) {
        sections.push(map[key]);
      }
    }
    return sections.length > 0 ? sections : ["Outros/Metadados"];
  };

  const filteredVersions = versions.filter(v =>
    (v.note || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(v.created_at).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold">Histórico de Versões</h3>
          <Button variant="ghost" size="sm" onClick={loadVersions}><RotateCcw className="h-4 w-4 mr-2" /> Atualizar</Button>
        </div>
        <Input
          placeholder="Filtrar por nota ou data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        {filteredVersions.length === 0 && <p className="text-center p-8 text-muted-foreground">Nenhuma versão encontrada.</p>}
        {filteredVersions.map((v, index) => {
          // Find the "previous" version in the original full list to compare correctly
          const originalIndex = versions.findIndex(ver => ver.id === v.id);
          const prevVersion = versions[originalIndex + 1];
          const changedSections = getChangedSections(v.content, prevVersion?.content);

          return (
            <div key={v.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-muted/10 transition-colors gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-ink">{v.note || "Salvamento Automático"}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  {new Date(v.created_at).toLocaleString('pt-BR')}
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-rose font-semibold">{changedSections.join(", ")}</span>
                </span>
              </div>
              <div className="flex gap-2 self-end md:self-auto">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-red-500"
                  onClick={() => handleDelete(v)}
                  title="Excluir Versão"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDiff(v)}
                  title="Ver detalhes"
                >
                  Detalhes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleRestore(v)}
                >
                  <RotateCcw className="h-4 w-4" /> Restaurar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={diffDialog} onOpenChange={setDiffDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Versão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-bold">Nota: {selectedVersion?.note}</p>
              <p className="text-sm text-muted-foreground">Data: {selectedVersion && new Date(selectedVersion.created_at).toLocaleString()}</p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Resumo das Alterações:</h4>
              <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                {selectedVersion && (() => {
                  const idx = versions.findIndex(ver => ver.id === selectedVersion.id);
                  const prev = versions[idx + 1];
                  if (!prev) return "Esta é a versão mais antiga. (Conteúdo Completo)";

                  const diffs: string[] = [];
                  const compare = (path: string, o: any, n: any) => {
                    if (JSON.stringify(o) === JSON.stringify(n)) return;
                    // Show section headers for top level keys
                    if (path === "root") {
                      // Top level keys (sections)
                      const allKeys = new Set([...Object.keys(o || {}), ...Object.keys(n || {})]);
                      allKeys.forEach(k => {
                        if (JSON.stringify(o?.[k]) !== JSON.stringify(n?.[k])) {
                          // Recurse into the section
                          compare(k, o?.[k], n?.[k]);
                        }
                      });
                      return;
                    }

                    if (typeof n !== 'object' || n === null || typeof o !== 'object' || o === null) {
                      // Leaf change
                      diffs.push(`Alteração em [${path}]:\n  ANTERIOR: "${JSON.stringify(o)?.slice(0, 50)}..."\n  NOVO:     "${JSON.stringify(n)?.slice(0, 50)}..."\n`);
                      return;
                    }

                    // Shallow compare keys inside section
                    const allKeys = new Set([...Object.keys(o || {}), ...Object.keys(n || {})]);
                    allKeys.forEach(k => {
                      compare(`${path} > ${k}`, o?.[k], n?.[k]);
                    });
                  };

                  try {
                    compare("root", prev.content, selectedVersion.content);
                  } catch (e) { return "Erro ao comparar."; }

                  return diffs.length > 0 ? diffs.map((d, i) => <div key={i} className="mb-2 border-b border-slate-800 pb-2 whitespace-pre-wrap">{d}</div>) : "Nenhuma alteração detectada nos campos monitorados.";
                })()}
              </div>
            </div>

            <details>
              <summary className="cursor-pointer text-sm font-bold mt-4">Ver JSON Completo</summary>
              <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-h-60">
                {JSON.stringify(selectedVersion?.content, null, 2)}
              </pre>
            </details>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
