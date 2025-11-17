import React from 'react';

export const IconBase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {props.children}
  </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></IconBase>
);

export const ClipboardDocumentListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></IconBase>
);

export const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.093-2.187-1.053-2.187h-.972c-.96 0-1.623 1.164-1.053 2.187 1.123 2.024 4.042 2.024 5.166 0zM6.578 18.72a9.097 9.097 0 012.18-2.962m0 0a5.21 5.21 0 01.527-1.649 2.5 2.5 0 00-4.739 0 .521.521 0 01.527 1.649m3.159 0c.533-.424 1.282-.636 2.043-.636 1.105 0 2.102.49 2.833 1.25M18 18.72a9.086 9.086 0 00-3.741-.479m0 0c0 2.296-1.864 4.16-4.16 4.16s-4.16-1.864-4.16-4.16c0-2.296 1.864-4.16 4.16-4.16 1.233 0 2.333.535 3.099 1.361m5.201 0c.26.15.503.315.732.488m-5.932 0c.449-.247.948-.425 1.475-.546m7.531 1.059a4.5 4.5 0 00-4.5-4.5c-1.178 0-2.25.456-3.06 1.203m7.531 1.059a9.095 9.095 0 01-2.18 2.962" /></IconBase>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></IconBase>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></IconBase>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 11.25h.008v.008H12v-.008z" /></IconBase>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);

export const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 11.25h.008v.008H12v-.008z" /></IconBase>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></IconBase>
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></IconBase>
);

export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></IconBase>
);

export const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-2.218l-1.007-1.007-.002-.002A9.755 9.755 0 012.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></IconBase>
);

export const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></IconBase>
);

export const ArrowUpTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></IconBase>
);

export const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></IconBase>
);

export const IdentificationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></IconBase>
);

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></IconBase>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></IconBase>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></IconBase>
);

export const TableCellsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 6.375h17.25M3.375 12.375h17.25M3.375 18.375h17.25M5.25 2.25v19.5M12 2.25v19.5M18.75 2.25v19.5M2.25 6.375h.008v.008H2.25v-.008zm.008 6h-.008v.008h.008v-.008zm0 6h-.008v.008h.008v-.008zm-1.132-3.002h.008v.008h-.008v-.008zm1.124 0h.008v.008h-.008v-.008z" /></IconBase>
);

export const Cog6ToothIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.223 1.197-.223 1.752 0 .549.223 1.02.684 1.11 1.226M9.594 18.06c.09.542.56 1.003 1.11 1.226.554-.223 1.197-.223 1.752 0 .549.223 1.02.684 1.11 1.226M12 21a9 9 0 100-18 9 9 0 000 18zM12 15a3 3 0 100-6 3 3 0 000 6z" /></IconBase>
);

export const ServerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.65H8.228a3.375 3.375 0 00-3.285 2.65l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" /></IconBase>
);

export const ClipboardDocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v11.25c0 .966-.784 1.75-1.75 1.75H8.25a1.75 1.75 0 01-1.75-1.75V4.5c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></IconBase>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></IconBase>
);