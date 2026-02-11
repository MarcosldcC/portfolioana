"use client";

import React, { useState, useEffect } from "react";
import {
  Type,
  ImageIcon,
  Link2,
  Save,
  Upload,
  Trash2,
  Plus,
  Check,
  Briefcase,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HalftonePattern } from "@/components/decorative-elements";
import { getSiteContent, updateSiteContent } from "@/app/actions/site-editor";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Tab = "textos" | "imagens" | "social" | "services";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "textos", label: "Textos Gerais", icon: Type },
  { id: "services", label: "Serviços", icon: Briefcase },
  { id: "imagens", label: "Portfólio", icon: ImageIcon },
  { id: "social", label: "Redes Sociais", icon: Link2 },
];

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("textos");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    const result = await updateSiteContent(data);
    setSaving(false);
    if (result.success) {
      toast.success("Alterações salvas com sucesso!");
    } else {
      toast.error("Erro ao salvar alterações.");
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-rose" /></div>;
  }

  if (!data) return <div>Erro ao carregar dados.</div>;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">
            Editor do Site
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Edite o conteúdo do seu portfólio sem precisar mexer no código.
          </p>
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
        {activeTab === "social" && <SocialEditor data={data} setData={setData} />}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-xs font-bold text-muted-foreground">
        {label}
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

  return (
    <div className="flex flex-col gap-6">
      {/* HERO */}
      <SectionCard title="Hero (Início)">
        <Field label="Saudação">
          <Input value={data.hero.greeting} onChange={(e) => handleChange("hero", "greeting", e.target.value)} />
        </Field>
        <Field label="Título Principal">
          <Input value={data.hero.title} onChange={(e) => handleChange("hero", "title", e.target.value)} className="font-serif" />
        </Field>
        <Field label="Descrição">
          <Textarea value={data.hero.description} onChange={(e) => handleChange("hero", "description", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Botão Portfólio">
            <Input value={data.hero.ctaPortfolio} onChange={(e) => handleChange("hero", "ctaPortfolio", e.target.value)} />
          </Field>
          <Field label="Botão Contato">
            <Input value={data.hero.ctaContact} onChange={(e) => handleChange("hero", "ctaContact", e.target.value)} />
          </Field>
        </div>
      </SectionCard>

      {/* ABOUT */}
      <SectionCard title="Sobre Mim">
        <Field label="Título">
          <Input value={data.about.title} onChange={(e) => handleChange("about", "title", e.target.value)} />
        </Field>
        <Field label="Subtítulo">
          <Input value={data.about.subtitle} onChange={(e) => handleChange("about", "subtitle", e.target.value)} className="font-serif" />
        </Field>
        <Field label="Descrição Completa">
          <Textarea value={data.about.description} onChange={(e) => handleChange("about", "description", e.target.value)} rows={5} />
        </Field>
        {/* Stats could be here, but let's keep it simple for now or implement detailed array editing */}
      </SectionCard>

      {/* SECTION TITLES */}
      <SectionCard title="Títulos das Seções">
        <Field label="Título Portfólio">
          <Input value={data.portfolio.title} onChange={(e) => handleChange("portfolio", "title", e.target.value)} />
        </Field>
        <Field label="Subtítulo Portfólio">
          <Input value={data.portfolio.subtitle} onChange={(e) => handleChange("portfolio", "subtitle", e.target.value)} />
        </Field>
        <Field label="Título Serviços">
          <Input value={data.services.title} onChange={(e) => handleChange("services", "title", e.target.value)} />
        </Field>
        <Field label="Subtítulo Serviços">
          <Input value={data.services.subtitle} onChange={(e) => handleChange("services", "subtitle", e.target.value)} />
        </Field>
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
    const newItem = { title: "Novo Serviço", description: "Descrição do serviço", icon: "Palette", color: "rose" };
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={addItem} variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Serviço
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.services.items.map((item: any, index: number) => (
          <div key={index} className="relative rounded-xl border border-border bg-background p-4 flex flex-col gap-3">
            <button onClick={() => removeItem(index)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
            <Field label="Ícone (Nome da biblioteca Lucide)">
              <Input value={item.icon} onChange={(e) => handleItemChange(index, "icon", e.target.value)} />
            </Field>
            <Field label="Título">
              <Input value={item.title} onChange={(e) => handleItemChange(index, "title", e.target.value)} className="font-bold" />
            </Field>
            <Field label="Descrição">
              <Textarea value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} />
            </Field>
            <Field label="Cor (rose, moss, slate, ink)">
              <Input value={item.color} onChange={(e) => handleItemChange(index, "color", e.target.value)} />
            </Field>
          </div>
        ))}
      </div>
    </div>
  )
}


/* ------ PORTFOLIO TAB ------ */
/* ------ UPLOAD COMPONENT ------ */
import { uploadImage } from "@/app/actions/analytics";

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

/* ------ PORTFOLIO TAB ------ */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function PortfolioEditor({ data, setData }: { data: any; setData: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    image: "/placeholder.svg"
  });

  // Handling Portfolio Items (Public Site)
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
    toast.success("Projeto adicionado à lista (clique em Salvar Alterações para persistir)");
  };

  const removeItem = (index: number) => {
    const newItems = data.portfolio.items.filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({
      ...prev,
      portfolio: { ...prev.portfolio, items: newItems }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* About Image */}
      <SectionCard title="Imagem de Perfil (Sobre)">
        <div className="flex flex-col gap-2">
          <Field label="Foto de Perfil">
            <ImageUploader
              currentImage={data.about.image}
              onUploadComplete={(url) => setData((prev: any) => ({ ...prev, about: { ...prev.about, image: url } }))}
            />
          </Field>
        </div>
      </SectionCard>

      <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-ink">
            <span className="inline-block h-2 w-2 rounded-full bg-moss" />
            Projetos do Portfólio
          </h3>
          <Button onClick={openNewProjectModal} size="sm" variant="outline" className="gap-2">
            <Plus className="h-3.5 w-3.5" />
            Adicionar Projeto
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.portfolio.items.map((item: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border bg-background"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col p-4 gap-3">
                <Field label="Título">
                  <Input value={item.title} onChange={(e) => handleItemChange(index, "title", e.target.value)} />
                </Field>
                <Field label="Categoria">
                  <Input value={item.category} onChange={(e) => handleItemChange(index, "category", e.target.value)} />
                </Field>
                <Field label="Descrição">
                  <Textarea value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} rows={2} />
                </Field>
                <Field label="Imagem">
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

      {/* New Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Projeto</DialogTitle>
            <DialogDescription>Preencha os dados do novo item do portfólio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Ex: Branding Café" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })} placeholder="Ex: Identidade Visual" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Imagem</Label>
              <ImageUploader
                currentImage={newProject.image}
                onUploadComplete={(url) => setNewProject({ ...newProject, image: url })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Breve descrição do projeto..." />
            </div>
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

/* ------ SOCIAL TAB ------ */
function SocialEditor({ data, setData }: { data: any; setData: any }) {
  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...data.social.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setData((prev: any) => ({
      ...prev,
      social: { ...prev.social, links: newLinks }
    }));
  };

  const addLink = () => {
    const newLink = { platform: "Instagram", url: "https://", color: "rose" };
    setData((prev: any) => ({
      ...prev,
      social: { ...prev.social, links: [...prev.social.links, newLink] }
    }));
  };

  const removeLink = (index: number) => {
    const newLinks = data.social.links.filter((_: any, i: number) => i !== index);
    setData((prev: any) => ({
      ...prev,
      social: { ...prev.social, links: newLinks }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-background/60 p-6 backdrop-blur-sm">
        <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-ink">
          <span className="inline-block h-2 w-2 rounded-full bg-rose" />
          Links das Redes Sociais
        </h3>
        <p className="mb-6 font-sans text-sm text-muted-foreground">
          Atualize os links que aparecem no rodapé. Use nomes como "Instagram", "LinkedIn", "TikTok", "Behance", "Twitter".
        </p>
        <div className="flex flex-col gap-4">
          {data.social.links.map((link: any, index: number) => (
            <div key={index} className="flex items-start gap-3 border p-3 rounded-lg relative group">
              <button onClick={() => removeLink(index)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex flex-1 flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Plataforma">
                    <Input value={link.platform} onChange={(e) => handleLinkChange(index, "platform", e.target.value)} />
                  </Field>
                  <Field label="Cor (Tailwind class ou hex)">
                    <Input value={link.color} onChange={(e) => handleLinkChange(index, "color", e.target.value)} />
                  </Field>
                </div>
                <Field label="URL">
                  <Input value={link.url} onChange={(e) => handleLinkChange(index, "url", e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={addLink} className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 font-sans text-sm font-bold text-muted-foreground transition-all hover:border-rose hover:text-rose">
        <Plus className="h-4 w-4" />
        Adicionar Nova Rede Social
      </button>
    </div>
  );
}
