import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useLocation } from "react-router";
import {
  ConfirmMessageModal,
  type ConfirmationOptions,
} from "~/components/organisms/modal/ConfirmMessageModal";

type RequestConfirmation = (options: ConfirmationOptions) => Promise<boolean>;

interface PendingConfirmation {
  id: number;
  options: ConfirmationOptions;
  locationKey: string;
  resolve: (confirmed: boolean) => void;
}

const ConfirmationContext = createContext<RequestConfirmation | null>(null);

export function ConfirmationProvider({ children }: PropsWithChildren) {
  const { key: locationKey } = useLocation();
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const pendingRef = useRef<PendingConfirmation | null>(null);
  const lastRequestId = useRef(0);

  const finish = useCallback((confirmed: boolean) => {
    const request = pendingRef.current;
    if (!request) return;

    pendingRef.current = null;
    setPending(null);
    request.resolve(confirmed);
  }, []);

  useEffect(() => {
    const request = pendingRef.current;
    if (request && request.locationKey !== locationKey) finish(false);
  }, [locationKey, finish]);

  useEffect(() => {
    return () => {
      const request = pendingRef.current;
      pendingRef.current = null;
      request?.resolve(false);
    };
  }, []);

  const requestConfirmation = useCallback<RequestConfirmation>(
    (options) => {
      if (pendingRef.current) return Promise.resolve(false);

      return new Promise((resolve) => {
        const request = { id: ++lastRequestId.current, options, locationKey, resolve };
        pendingRef.current = request;
        setPending(request);
      });
    },
    [locationKey],
  );

  return (
    <ConfirmationContext.Provider value={requestConfirmation}>
      {children}
      {pending && pending.locationKey === locationKey && (
        <ConfirmMessageModal
          key={pending.id}
          {...pending.options}
          onCancel={() => finish(false)}
          onConfirm={() => finish(true)}
        />
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const requestConfirmation = useContext(ConfirmationContext);
  if (!requestConfirmation) {
    throw new Error("useConfirmation requer ConfirmationProvider");
  }
  return requestConfirmation;
}
