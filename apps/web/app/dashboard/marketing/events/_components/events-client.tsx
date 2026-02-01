"use client";

import { useState } from "react";
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Switch, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@smart-menu/ui";
import { toast } from "sonner";
import { PartyPopper, Plus, Trash2, Save, Edit, Calendar, MapPin, Ticket, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/utils/api-client";

interface Event {
    id?: string;
    name: Record<string, string>;
    description: Record<string, string> | null;
    imageUrl: string | null;
    date: string;
    endDate: string | null;
    location: string | null;
    ticketLink: string | null;
    isActive: boolean;
}

interface EventsClientProps {
    initialEvents: Event[];
}

function getLocalizedName(name: Record<string, string> | string): string {
    if (typeof name === 'string') return name;
    return name?.pt || name?.en || Object.values(name)[0] || '';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function EventsClient({ initialEvents }: EventsClientProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const upcomingEvents = events.filter(e => e.isActive && new Date(e.date) >= new Date());
    const pastEvents = events.filter(e => !e.isActive || new Date(e.date) < new Date());

    const openCreateDialog = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1, 0, 0, 0);
        setEditingEvent({
            name: { pt: '', en: '' },
            description: { pt: '', en: '' },
            imageUrl: '',
            date: now.toISOString().slice(0, 16),
            endDate: null,
            location: '',
            ticketLink: '',
            isActive: true,
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (event: Event) => {
        setEditingEvent({
            ...event,
            date: event.date.slice(0, 16),
            endDate: event.endDate ? event.endDate.slice(0, 16) : null,
        });
        setIsDialogOpen(true);
    };

    const updateEventField = (field: keyof Event, value: unknown) => {
        if (!editingEvent) return;
        setEditingEvent({ ...editingEvent, [field]: value });
    };

    const updateEventI18n = (field: 'name' | 'description', lang: string, value: string) => {
        if (!editingEvent) return;
        const current = editingEvent[field] || {};
        setEditingEvent({ ...editingEvent, [field]: { ...current, [lang]: value } });
    };

    const saveEvent = async () => {
        if (!editingEvent || !editingEvent.name?.pt) {
            toast.error("Preencha o nome do evento");
            return;
        }
        setSaving(true);

        try {
            const payload = {
                name: editingEvent.name,
                description: editingEvent.description,
                imageUrl: editingEvent.imageUrl,
                date: new Date(editingEvent.date).toISOString(),
                endDate: editingEvent.endDate ? new Date(editingEvent.endDate).toISOString() : null,
                location: editingEvent.location,
                ticketLink: editingEvent.ticketLink,
                isActive: editingEvent.isActive,
            };

            if (editingEvent.id) {
                const updated = await apiClient<Event>(`/marketing/events/${editingEvent.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
                setEvents(events.map(e => e.id === updated.id ? updated : e));
            } else {
                const created = await apiClient<Event>('/marketing/events', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
                setEvents([...events, created]);
            }

            setIsDialogOpen(false);
            setEditingEvent(null);
            toast.success(editingEvent.id ? "Evento atualizado!" : "Evento criado!");
        } catch (error) {
            console.error('Error saving event:', error);
            toast.error("Erro ao guardar evento");
        } finally {
            setSaving(false);
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            await apiClient(`/marketing/events/${id}`, { method: 'DELETE' });
            setEvents(events.filter(e => e.id !== id));
            toast.success("Evento removido");
        } catch (error) {
            toast.error("Erro ao remover evento");
        }
    };

    const renderEventCard = (event: Event) => (
        <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                    {event.imageUrl && (
                        <div className="w-32 h-32 flex-shrink-0">
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-base">{getLocalizedName(event.name)}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(event.date)}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id!)} className="text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2">
                                {event.location && (
                                    <Badge variant="secondary" className="text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {event.location}
                                    </Badge>
                                )}
                                {event.ticketLink && (
                                    <Badge variant="secondary" className="text-xs">
                                        <Ticket className="h-3 w-3 mr-1" />
                                        Com bilhetes
                                    </Badge>
                                )}
                                {!event.isActive && (
                                    <Badge variant="outline" className="text-xs text-zinc-500">
                                        Inativo
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={openCreateDialog} className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Evento
                </Button>
            </div>

            {/* Próximos Eventos */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium">Próximos Eventos ({upcomingEvents.length})</h4>
                <AnimatePresence>
                    {upcomingEvents.length === 0 ? (
                        <Card className="border-dashed bg-zinc-50/50">
                            <CardContent className="py-12 text-center">
                                <PartyPopper className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                                <p className="text-sm text-zinc-500">Nenhum evento agendado</p>
                                <Button variant="link" onClick={openCreateDialog} className="text-orange-600 mt-2">
                                    Criar primeiro evento
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">{upcomingEvents.map(renderEventCard)}</div>
                    )}
                </AnimatePresence>
            </div>

            {/* Eventos Passados */}
            {pastEvents.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-zinc-500">Eventos Passados ({pastEvents.length})</h4>
                    <div className="grid gap-4 opacity-60">
                        {pastEvents.map(renderEventCard)}
                    </div>
                </div>
            )}

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingEvent?.id ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome (PT)</Label>
                                <Input
                                    value={editingEvent?.name?.pt || ''}
                                    onChange={(e) => updateEventI18n('name', 'pt', e.target.value)}
                                    placeholder="Ex: Noite de Fado"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nome (EN)</Label>
                                <Input
                                    value={editingEvent?.name?.en || ''}
                                    onChange={(e) => updateEventI18n('name', 'en', e.target.value)}
                                    placeholder="Ex: Fado Night"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Descrição (PT)</Label>
                                <Input
                                    value={editingEvent?.description?.pt || ''}
                                    onChange={(e) => updateEventI18n('description', 'pt', e.target.value)}
                                    placeholder="Descrição do evento"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Descrição (EN)</Label>
                                <Input
                                    value={editingEvent?.description?.en || ''}
                                    onChange={(e) => updateEventI18n('description', 'en', e.target.value)}
                                    placeholder="Event description"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Data e Hora</Label>
                                <Input
                                    type="datetime-local"
                                    value={editingEvent?.date || ''}
                                    onChange={(e) => updateEventField('date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Fim (opcional)</Label>
                                <Input
                                    type="datetime-local"
                                    value={editingEvent?.endDate || ''}
                                    onChange={(e) => updateEventField('endDate', e.target.value || null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Local</Label>
                            <Input
                                value={editingEvent?.location || ''}
                                onChange={(e) => updateEventField('location', e.target.value)}
                                placeholder="Ex: Salão Principal, Esplanada"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Link para Bilhetes (opcional)</Label>
                            <Input
                                value={editingEvent?.ticketLink || ''}
                                onChange={(e) => updateEventField('ticketLink', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>URL da Imagem</Label>
                            <Input
                                value={editingEvent?.imageUrl || ''}
                                onChange={(e) => updateEventField('imageUrl', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                checked={editingEvent?.isActive || false}
                                onCheckedChange={(checked) => updateEventField('isActive', checked)}
                            />
                            <Label>Evento ativo (visível no menu)</Label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={saveEvent} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                            {saving ? 'A guardar...' : <><Save className="h-4 w-4 mr-2" /> Guardar</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
