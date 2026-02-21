import { PasswordList } from './PasswordList';
import { PasswordDetails } from './PasswordDetails';
import { useVaultStore } from '../store/useStore';

export function Dashboard() {
    const { selectedItemId } = useVaultStore();

    return (
        <div className="flex w-full h-full gap-6 pb-6 relative">
            <div className={`w-full lg:w-[360px] flex-shrink-0 flex-col h-full overflow-hidden ${selectedItemId ? 'hidden lg:flex' : 'flex'}`}>
                <PasswordList />
            </div>

            <div className={`flex-1 flex-col h-full overflow-hidden min-w-0 ${selectedItemId ? 'flex' : 'hidden lg:flex'}`}>
                <PasswordDetails />
            </div>
        </div>
    );
}
