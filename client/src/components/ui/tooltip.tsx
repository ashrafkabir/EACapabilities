import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayDuration?: number;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delayDuration = 300,
  className,
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let x = 0;
    let y = 0;

    switch (side) {
      case "top":
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - 8;
        break;
      case "bottom":
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case "left":
        x = triggerRect.left - 8;
        y = triggerRect.top + triggerRect.height / 2;
        break;
      case "right":
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2;
        break;
    }

    setPosition({ x, y });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getArrowClasses = () => {
    const base = "absolute w-2 h-2 bg-gray-900 dark:bg-gray-100 transform rotate-45";
    
    switch (side) {
      case "top":
        return cn(base, "bottom-[-4px] left-1/2 -translate-x-1/2");
      case "bottom":
        return cn(base, "top-[-4px] left-1/2 -translate-x-1/2");
      case "left":
        return cn(base, "right-[-4px] top-1/2 -translate-y-1/2");
      case "right":
        return cn(base, "left-[-4px] top-1/2 -translate-y-1/2");
      default:
        return base;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-md shadow-lg",
            maxWidth,
            className
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
          role="tooltip"
        >
          <div className={getArrowClasses()} />
          {content}
        </div>
      )}
    </>
  );
}

interface DeepDiveTooltipProps {
  entity: {
    name: string;
    type: 'capability' | 'application' | 'component' | 'interface' | 'dataObject' | 'initiative';
    count?: number;
    description?: string;
    businessCapabilities?: string;
    technologies?: string;
    status?: string;
    technicalSuitability?: string;
    functionalFit?: string;
    applications?: string;
    interfaces?: string;
    dataObjects?: string;
    initiatives?: string;
    level?: number;
    level1Capability?: string;
    level2Capability?: string;
    level3Capability?: string;
  };
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  maxWidth?: string;
}

export function DeepDiveTooltip({ 
  entity, 
  children, 
  side = "top",
  maxWidth = "max-w-sm"
}: DeepDiveTooltipProps) {
  const getTooltipContent = () => {
    const { name, type, count, description, businessCapabilities, technologies, status } = entity;
    
    return (
      <div className="space-y-2">
        <div className="font-semibold text-sm border-b border-gray-600 dark:border-gray-300 pb-1">
          {name}
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 dark:text-gray-600">Type:</span>
            <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
          </div>
          
          {count !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-600">Count:</span>
              <span className="font-medium">{count}</span>
            </div>
          )}
          
          {description && (
            <div>
              <span className="text-gray-400 dark:text-gray-600">Description:</span>
              <p className="mt-1 text-gray-300 dark:text-gray-700 leading-relaxed">
                {description.length > 150 ? `${description.substring(0, 150)}...` : description}
              </p>
            </div>
          )}
          
          {businessCapabilities && (
            <div>
              <span className="text-gray-400 dark:text-gray-600">Capabilities:</span>
              <p className="mt-1 text-gray-300 dark:text-gray-700">
                {businessCapabilities.length > 100 ? `${businessCapabilities.substring(0, 100)}...` : businessCapabilities}
              </p>
            </div>
          )}
          
          {technologies && (
            <div>
              <span className="text-gray-400 dark:text-gray-600">Technologies:</span>
              <p className="mt-1 text-gray-300 dark:text-gray-700">
                {technologies.length > 100 ? `${technologies.substring(0, 100)}...` : technologies}
              </p>
            </div>
          )}
          
          {status && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-600">Status:</span>
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                status.toLowerCase() === 'active' ? 'bg-green-900 text-green-200' :
                status.toLowerCase() === 'retired' ? 'bg-red-900 text-red-200' :
                'bg-gray-700 text-gray-300'
              )}>
                {status}
              </span>
            </div>
          )}
          
          {entity.technicalSuitability && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-600">Technical:</span>
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                entity.technicalSuitability.toLowerCase() === 'perfect' ? 'bg-green-900 text-green-200' :
                entity.technicalSuitability.toLowerCase() === 'appropriate' ? 'bg-yellow-900 text-yellow-200' :
                'bg-red-900 text-red-200'
              )}>
                {entity.technicalSuitability}
              </span>
            </div>
          )}
          
          {entity.functionalFit && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-600">Functional:</span>
              <span className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                entity.functionalFit.toLowerCase() === 'perfect' ? 'bg-green-900 text-green-200' :
                entity.functionalFit.toLowerCase() === 'appropriate' ? 'bg-yellow-900 text-yellow-200' :
                'bg-red-900 text-red-200'
              )}>
                {entity.functionalFit}
              </span>
            </div>
          )}
          
          {type === 'capability' && entity.level && (
            <div>
              <span className="text-gray-400 dark:text-gray-600">Hierarchy:</span>
              <p className="mt-1 text-gray-300 dark:text-gray-700">
                {[entity.level1Capability, entity.level2Capability, entity.level3Capability]
                  .filter(Boolean)
                  .join(' → ')}
              </p>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-600 pt-1 border-t border-gray-600 dark:border-gray-300">
            Click for detailed view
          </div>
        </div>
      </div>
    );
  };

  return (
    <Tooltip 
      content={getTooltipContent()} 
      side={side}
      maxWidth={maxWidth}
      delayDuration={300}
    >
      {children}
    </Tooltip>
  );
}