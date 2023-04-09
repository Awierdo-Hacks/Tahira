import { ECODES } from './ecodes';

export type Status = {
  status: 'Halal' | 'Haram' | 'Mushbooh';
  becauseOf?: string;
};

export function checkIfHalal(ecodes: string[]): Status {
  let foundmushbooh = undefined;
  for (const ecode of ecodes) {
    const foundECode = ECODES.filter(
      (e) => e.ecode.slice(1) == ecode.slice(ecode.indexOf(':') + 2)
    );
    if (foundECode.length == 1) {
      if (foundECode[0].status == 'mushbooh')
        foundmushbooh = foundECode[0].ecode;
      if (foundECode[0].status == 'haram')
        return { status: 'Haram', becauseOf: foundECode[0].ecode };
    }
  }
  if (foundmushbooh) return { status: 'Mushbooh', becauseOf: foundmushbooh };
  return { status: 'Halal' };
}
