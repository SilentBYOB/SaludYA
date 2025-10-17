
import React from 'react';
import Logo from './Logo';
import { SubscriptionLevel } from '../types';

interface HeaderProps {
    onNewConsultation: () => void;
    subscription: SubscriptionLevel;
    setSubscription: (level: SubscriptionLevel) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewConsultation, subscription, setSubscription }) => {
    const isPro = subscription === SubscriptionLevel.Pro;

    return (
        <header className="bg-primary shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    <Logo variant="inverse" />
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${!isPro ? 'text-white' : 'text-blue-200'}`}>Gratis</span>
                            <button
                                onClick={() => setSubscription(isPro ? SubscriptionLevel.Free : SubscriptionLevel.Pro)}
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white ${isPro ? 'bg-primary-light' : 'bg-black bg-opacity-20'}`}
                                type="button"
                                aria-checked={isPro}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isPro ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </button>
                            <span className={`text-sm font-medium ${isPro ? 'text-white' : 'text-blue-200'}`}>Pro</span>
                        </div>
                        <button
                            onClick={onNewConsultation}
                            className="hidden md:inline-block bg-white text-primary font-bold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                            Nueva Consulta
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;