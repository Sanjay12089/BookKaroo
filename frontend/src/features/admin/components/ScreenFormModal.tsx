import { useState } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { useCreateScreen, useUpdateScreen } from '../api/useAdmin';
import { LayoutBuilder } from './LayoutBuilder';
import type { ScreenDetail } from '../types';

interface Props {
  mode:      'create' | 'edit';
  venueId:   string;
  venueName: string;
  screen?:   ScreenDetail;
  onClose:   () => void;
  onSuccess: () => void;
}

export function ScreenFormModal({ mode, venueId, venueName, screen, onClose, onSuccess }: Props) {
  const createMutation = useCreateScreen();
  const updateMutation = useUpdateScreen();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const defaultLayout = screen?.layout
    ? JSON.stringify(screen.layout, null, 2)
    : JSON.stringify({
        rows: 7, cols: 10,
        categories: [
          { name: 'Executive', rows: ['C','D','E','F'], price: 300, color: '#4169E1' },
          { name: 'Normal',    rows: ['G','H','I','J'], price: 150, color: '#E4E4E7' },
        ],
        blockedSeats: [],
        aisleAfterCols: [],
      }, null, 2);

  const [name, setName]           = useState(screen?.name ?? '');
  const [layoutJson, setLayoutJson] = useState(defaultLayout);
  const [isActive, setIsActive]   = useState(screen?.isActive ?? true);
  const [isValid, setIsValid]     = useState(true);
  const [nameError, setNameError] = useState('');

  const handleLayoutChange = (json: string) => {
    setLayoutJson(json);
    try { JSON.parse(json); setIsValid(true); }
    catch { setIsValid(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Screen name is required.'); return; }
    if (!isValid) return;

    const payload = { name: name.trim(), layoutJson, isActive };

    if (mode === 'create') {
      await createMutation.mutateAsync({ venueId, data: payload });
    } else {
      await updateMutation.mutateAsync({ screenId: screen!.id, venueId, data: payload });
    }
    onSuccess();
    onClose();
  };

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-xl text-tx-primary">
          {mode === 'create' ? `Add Screen — ${venueName}` : `Edit Screen — ${screen?.name}`}
        </h2>
        <button onClick={onClose} className="text-tx-muted hover:text-tx-primary transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Basic info */}
        <section className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-tx-primary mb-1">Screen Name *</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              placeholder="SCREEN 1 / AUDI 2 / IMAX SCREEN"
              className="w-full px-3 py-2 rounded-lg bg-section border border-border-l text-tx-primary text-sm focus:outline-none focus:border-brand"
            />
            {nameError && <p className="text-xs text-error mt-1">{nameError}</p>}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-tx-primary">Active</label>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-success-bg' : 'bg-section'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Layout builder */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-tx-muted uppercase tracking-wider">Seat Layout Builder</h3>
          <p className="text-xs text-tx-muted">Define seat categories, rows, and pricing for this screen.</p>
          <LayoutBuilder value={layoutJson} onChange={handleLayoutChange} />
        </section>

        {/* Footer */}
        <div className="flex gap-3 pt-2 sticky bottom-0 bg-card pb-1">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-border-l text-tx-secondary hover:bg-section transition-colors text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="flex-1 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Saving…' : mode === 'create' ? 'Create Screen' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
