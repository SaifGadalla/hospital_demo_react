import React from 'react';
import { useTranslation } from 'react-i18next';

type AppPageProps = {
  title: string;
  description: string;
  mainButtonTitle: string;
  mainButtonOnTap: () => void;
  secondaryButtons?: React.ReactNode[];
  numberCards?: React.ReactNode[];
  secondarySearchHeaderWidgets?: React.ReactNode[];
  trailingWidget?: React.ReactNode;
  hasSearch?: boolean;
  table?: React.ReactNode;
  tableHeader?: string;
  customBody?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export default function AppPage({
  title,
  description,
  mainButtonTitle,
  mainButtonOnTap,
  secondaryButtons,
  numberCards,
  secondarySearchHeaderWidgets,
  trailingWidget,
  hasSearch = false,
  table,
  tableHeader,
  customBody,
  searchValue,
  onSearchChange,
}: AppPageProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full bg-background">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-h2 text-text-primary">{title}</h1>
            <p className="text-bodyMedium text-text-secondary mt-1">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {secondaryButtons?.map((btn, idx) => (
              <React.Fragment key={idx}>{btn}</React.Fragment>
            ))}
            <button
              onClick={mainButtonOnTap}
              className="bg-primary hover:bg-primary-dark text-text-inverse px-6 py-2 rounded-2xl text-buttonText transition-colors"
            >
              {mainButtonTitle}
            </button>
          </div>
        </div>

        {/* Number Cards */}
        {numberCards && numberCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5 w-full">
            {numberCards.map((card, idx) => (
              <React.Fragment key={idx}>{card}</React.Fragment>
            ))}
          </div>
        )}

        {/* Search Header */}
        {hasSearch && (
          <div className="bg-surface rounded-2xl border border-border-theme shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchValue || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full md:w-[300px] bg-surface-elevated border border-border-theme rounded-xl px-4 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />

              {secondarySearchHeaderWidgets && secondarySearchHeaderWidgets.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {secondarySearchHeaderWidgets.map((widget, idx) => (
                    <React.Fragment key={idx}>{widget}</React.Fragment>
                  ))}
                </div>
              )}

              <div className="flex-1" />

              {trailingWidget && (
                <div>{trailingWidget}</div>
              )}
            </div>
          </div>
        )}

        {/* Custom Body */}
        {customBody && (
          <div>{customBody}</div>
        )}

        {/* Table Container */}
        {table && (
          <div className="bg-surface rounded-2xl border border-border-theme shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
            {tableHeader && (
              <>
                <div className="p-5">
                  <h3 className="text-h4 text-text-primary">{tableHeader}</h3>
                </div>
                <hr className="border-divider" />
              </>
            )}
            <div className="w-full overflow-x-auto">
              {table}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
