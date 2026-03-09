import UpdateStatus from "./update-status";
import { Box, Check, MapPinCheck, MapPinned, Truck, Undo2 } from "lucide-react";
import { useParams } from "next/navigation";
import AcceptStatus from "./accept-status";

interface Props {
  deliveryStatus?: string;
  token: string;
  lenderId: string;
}

const PickupStatus = ({ deliveryStatus, token, lenderId }: Props) => {
  const params = useParams();
  const bookingId = params.id;

  const statusOrder = [
    "Pending",
    "ReadyForPickup",
    "PickedUpByCustomer",
    "Return Due",
    "Dress Returned",
  ];

  const getCurrentIndex = (status: string) => {
    if (status === "ReturnLinkSent") return statusOrder.indexOf("Return Due");
    const index = statusOrder.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getCurrentIndex(deliveryStatus as string);

  return (
    <div className="flex w-full gap-12 items-start py-6">
      {/* accept/reject */}
      <AcceptStatus
        deliveryStatus={deliveryStatus as string}
        token={token}
        bookingId={bookingId as string}
        lenderId={lenderId}
      />

      {/* ready for pickup */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="ReadyForPickup"
        negativeStatusValue="Cannot Fullfill"
        negativeBtnName="Cannot Fulfill"
        completedBtnName="Ready"
        IconName={Check}
        bookingId={bookingId as string}
        btnName="Ready for Pickup"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("ReadyForPickup")}
        isDisabled={currentIndex !== statusOrder.indexOf("Pending")}
      />

      {/* mark as shipped */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="PickedUpByCustomer"
        completedBtnName="Picked Up"
        IconName={MapPinCheck}
        bookingId={bookingId as string}
        btnName="Picked Up By Customer"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("PickedUpByCustomer")}
        isDisabled={currentIndex !== statusOrder.indexOf("ReadyForPickup")}
      />

      {/* return due */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Return Due"
        completedBtnName="Handed Over"
        IconName={Undo2}
        bookingId={bookingId as string}
        btnName="Return Due"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("Return Due")}
        isDisabled={currentIndex !== statusOrder.indexOf("PickedUpByCustomer")}
      />

      {/* dress returned */}
      <UpdateStatus
        deliveryStatus={deliveryStatus as string}
        statusValue="Dress Returned"
        completedBtnName="Returned"
        IconName={Box}
        bookingId={bookingId as string}
        btnName="Dress Returned"
        token={token}
        isCompleted={currentIndex >= statusOrder.indexOf("Dress Returned")}
        isDisabled={currentIndex !== statusOrder.indexOf("Return Due")}
      />
    </div>
  );
};

export default PickupStatus;
