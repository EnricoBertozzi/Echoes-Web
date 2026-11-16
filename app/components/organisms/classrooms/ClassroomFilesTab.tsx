import { FiFolder } from "react-icons/fi";
import { Card } from "~/components/atoms/card/Card";

/**
 * Aba "Arquivos". O servidor ainda não tem endpoints de materiais por turma
 * (nem o ClassroomController nem o ScenarioController, que é só do ADMIN e
 * não se liga a turmas). Quando existirem, esta aba lista, envia, edita e
 * exclui materiais; o botão de envio fica restrito ao professor.
 */
export function ClassroomFilesTab() {
  return (
    <Card className="items-center py-16 text-center">
      <FiFolder size={48} className="text-slate-400" aria-hidden="true" />

      <h2 className="text-2xl font-bold text-slate-900">
        Os materiais ainda não estão disponíveis
      </h2>

      <p className="max-w-md text-lg text-slate-600">
        Quando o envio de materiais for liberado, os arquivos e links da turma
        aparecerão aqui.
      </p>
    </Card>
  );
}
