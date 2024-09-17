import Card from "components/card";

type OtherWidgetProps = {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  color:string;
};

const OtherWidget: React.FC<OtherWidgetProps> = ({ icon, title, subtitle, color }) => {
  return (
    <Card extra="!flex-col items-center rounded-[20px] p-4">
      {/* Conteneur de l'icône */}
      <div className="flex items-center justify-center mb-4">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className={`flex items-center ${color} dark:text-white`}>
            {icon}
          </span>
        </div>
      </div>

      {/* Conteneur des textes */}
      <div className="flex flex-col items-center justify-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {subtitle}
        </h4>
      </div>
    </Card>
  );
};

export default OtherWidget;
