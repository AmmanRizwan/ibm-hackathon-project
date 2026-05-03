import { useEffect, useState } from 'react';
import { MapPin, Building2, Map, Navigation, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getUserBillingDetails } from '@/service/billing_details';
import PageLoader from '@/components/custom/page-loader';
import { Alert } from '@/components/ui/alert';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface BillingDetailType {
    id: string;
    address: string;
    pin: string;
    city: string;
    state: string;
    isVerify: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

const BillingDetail = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    const [billingDetails, setBillingDetails] = useState<BillingDetailType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchBillingDetails();
    }, []);

    const fetchBillingDetails = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await getUserBillingDetails();
            setBillingDetails(response.data || []);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to fetch billing details');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto py-8 px-4 max-w-4xl">
            <PageLoader isLoading={isLoading} />
            
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Billing Details</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your billing addresses
                    </p>
                </div>
                {/* Hide Add Address button if billing detail already exists */}
                {billingDetails.length === 0 && !isLoading && (
                    <Button className="border hover:shadow" onClick={() => navigate('new')}>
                        Add Address
                    </Button>
                )}
            </div>

            {/* Error Message */}
            {errorMessage && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                    <p className="text-red-800">{errorMessage}</p>
                </Alert>
            )}

            <div className="grid gap-6">
                {billingDetails.map((detail) => (
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
                                {
                                    user.role === "admin" ?
                                    (
                                      null   
                                    ) :
                                    (
                                        <Badge variant={detail.isVerify ? "default" : "secondary"}>
                                            {detail.isVerify ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Pending
                                                </>
                                            )}
                                        </Badge>
                                    )
                                }
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
            {billingDetails.length === 0 && !isLoading && !errorMessage && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No billing details found
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Add your first billing address to get started
                        </p>
                        <Button onClick={() => navigate('new')}>Add Billing Address</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default BillingDetail;

// Made with Bob