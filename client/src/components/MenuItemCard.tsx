import { MenuItem } from "@/types";
import { Card, CardContent, CardHeader } from "./ui/card";

type Props = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItemCard = ({ menuItem, addToCart }: Props) => {
  return (
    <Card className="cursor-pointer" onClick={addToCart}>
      <CardHeader>{menuItem.name}</CardHeader>
      <CardContent className="font-bold">
        &#x20b9;{(menuItem.price / 100).toFixed(2)}
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
