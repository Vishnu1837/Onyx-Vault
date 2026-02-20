import { PasswordList } from './PasswordList';
import { PasswordDetails } from './PasswordDetails';

export function Dashboard() {
    return (
        <div className="flex w-full h-full gap-6 pb-6">
            <div className="w-[360px] flex-shrink-0 flex flex-col h-full overflow-hidden">
                <PasswordList />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                <PasswordDetails />
            </div>
        </div>
    );
}
