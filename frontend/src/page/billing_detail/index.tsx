import { MapPin, Building2, Map, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Sample/Random billing details data
const sampleBillingDetails = [
    {
        id: 1,
        address: '123 Main Street, Apartment 4B, Downtown',
        pin: '400001',
        city: 'Mumbai',
        state: 'Maharashtra',
    }
];

const BillingDetail = () => {

    return (
        <div className="mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Billing Details</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your billing addresses
                    </p>
                </div>
                <Button className="border hover:shadow">
                    Add Address
                </Button>
            </div>

            <div className="grid gap-6">
                {sampleBillingDetails.map((detail) => (
                    <Card key={detail.id} className="relative">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Billing Address
                                    </CardTitle>
                                    <CardDescription>
                                        Complete billing information
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Address */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Address
                                        </p>
                                        <p className="text-base">{detail.address}</p>
                                    </div>
                                </div>

                                {/* PIN Code */}
                                <div className="flex items-start gap-3">
                                    <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            PIN Code
                                        </p>
                                        <p className="text-base">{detail.pin}</p>
                                    </div>
                                </div>

                                {/* City */}
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            City
                                        </p>
                                        <p className="text-base">{detail.city}</p>
                                    </div>
                                </div>

                                {/* State */}
                                <div className="flex items-start gap-3">
                                    <Map className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            State
                                        </p>
                                        <p className="text-base">{detail.state}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State (if no billing details) */}
            {sampleBillingDetails.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No billing details found
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Add your first billing address to get started
                        </p>
                        <Button>Add Billing Address</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BillingDetail;

// Made with Bob