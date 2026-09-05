/* ------------------------------------------------------------------ */
/*  簡易圖示庫（取代 lucide-react，讓獨立版不需要額外套件）              */
/* ------------------------------------------------------------------ */
function IconBase(props) {
  var size = props.size || 18;
  var strokeWidth = props.strokeWidth || 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color || "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={props.style}
      className={props.className}
    >
      {props.children}
    </svg>
  );
}

function Search(p) { return <IconBase {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconBase>; }
function ChevronDown(p) { return <IconBase {...p}><polyline points="6 9 12 15 18 9" /></IconBase>; }
function ChevronUp(p) { return <IconBase {...p}><polyline points="18 15 12 9 6 15" /></IconBase>; }
function ChevronLeft(p) { return <IconBase {...p}><polyline points="15 18 9 12 15 6" /></IconBase>; }
function ChevronRight(p) { return <IconBase {...p}><polyline points="9 18 15 12 9 6" /></IconBase>; }
function Pencil(p) { return <IconBase {...p}><path d="M3 21l4-1L20 7l-3-3L4 17z" /></IconBase>; }
function Trash2(p) { return <IconBase {...p}><rect x="9" y="2" width="6" height="3" /><line x1="3" y1="6" x2="21" y2="6" /><rect x="5" y="6" width="14" height="15" rx="1" /><line x1="10" y1="10" x2="10" y2="17" /><line x1="14" y1="10" x2="14" y2="17" /></IconBase>; }
function Plus(p) { return <IconBase {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></IconBase>; }
function X(p) { return <IconBase {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconBase>; }
function Palette(p) { return <IconBase {...p}><circle cx="12" cy="12" r="9" /><circle cx="8" cy="10" r="1.2" /><circle cx="12" cy="8" r="1.2" /><circle cx="16" cy="10" r="1.2" /><circle cx="10" cy="15" r="1.2" /></IconBase>; }
function Calendar(p) { return <IconBase {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconBase>; }
function Store(p) { return <IconBase {...p}><polyline points="3 9 5 3 19 3 21 9" /><rect x="4" y="9" width="16" height="11" /><line x1="9" y1="20" x2="9" y2="13" /><line x1="15" y1="20" x2="15" y2="13" /></IconBase>; }
function ShoppingBag(p) { return <IconBase {...p}><rect x="9" y="3" width="6" height="5" rx="2" /><path d="M6 8h12l-1 12H7z" /></IconBase>; }
function Tag(p) { return <IconBase {...p}><path d="M3 3h8l10 10-8 8L3 11z" /><circle cx="8" cy="8" r="1.3" /></IconBase>; }
function Truck(p) { return <IconBase {...p}><rect x="1" y="7" width="13" height="10" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="1.6" /><circle cx="17" cy="19" r="1.6" /></IconBase>; }
function CreditCard(p) { return <IconBase {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></IconBase>; }
function Gift(p) { return <IconBase {...p}><rect x="4" y="9" width="16" height="12" /><rect x="2" y="6" width="20" height="4" /><line x1="12" y1="6" x2="12" y2="21" /></IconBase>; }
function BarChart3(p) { return <IconBase {...p}><rect x="3" y="10" width="4" height="10" /><rect x="10" y="4" width="4" height="16" /><rect x="17" y="14" width="4" height="6" /></IconBase>; }
function Settings(p) { return <IconBase {...p}><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" /><line x1="4.9" y1="19.1" x2="7" y2="17" /><line x1="17" y1="7" x2="19.1" y2="4.9" /></IconBase>; }
function Type(p) { return <IconBase {...p}><line x1="5" y1="4" x2="19" y2="4" /><line x1="12" y1="4" x2="12" y2="20" /></IconBase>; }
function ImagePlus(p) { return <IconBase {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><polyline points="21 15 16 10 5 21" /></IconBase>; }
function UploadCloud(p) { return <IconBase {...p}><circle cx="8" cy="14" r="4" /><circle cx="13" cy="11" r="5" /><circle cx="17" cy="14" r="3.5" /><rect x="6" y="14" width="13" height="5" /><line x1="12" y1="20" x2="12" y2="12" /><polyline points="9 15 12 12 15 15" /></IconBase>; }
function DownloadCloud(p) { return <IconBase {...p}><circle cx="8" cy="14" r="4" /><circle cx="13" cy="11" r="5" /><circle cx="17" cy="14" r="3.5" /><rect x="6" y="14" width="13" height="5" /><line x1="12" y1="12" x2="12" y2="20" /><polyline points="9 17 12 20 15 17" /></IconBase>; }
function Cloud(p) { return <IconBase {...p}><circle cx="8" cy="14" r="4" /><circle cx="13" cy="11" r="5" /><circle cx="17" cy="14" r="3.5" /><rect x="6" y="14" width="13" height="5" /></IconBase>; }
function Check(p) { return <IconBase {...p}><polyline points="4 12 9 17 20 6" /></IconBase>; }
function ScanLine(p) { return <IconBase {...p}><polyline points="4 8 4 4 8 4" /><polyline points="16 4 20 4 20 8" /><polyline points="20 16 20 20 16 20" /><polyline points="8 20 4 20 4 16" /><line x1="4" y1="12" x2="20" y2="12" /></IconBase>; }
function Crop(p) { return <IconBase {...p}><line x1="6" y1="2" x2="6" y2="18" /><line x1="2" y1="6" x2="18" y2="6" /><line x1="18" y1="6" x2="18" y2="22" /><line x1="6" y1="18" x2="22" y2="18" /></IconBase>; }
function Loader2(p) { return <IconBase {...p}><circle cx="12" cy="12" r="9" strokeDasharray="42 14" /></IconBase>; }
function Clipboard(p) { return <IconBase {...p}><rect x="6" y="4" width="12" height="17" rx="1.5" /><rect x="9" y="2" width="6" height="3.5" rx="1" /></IconBase>; }
