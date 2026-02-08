import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { API_BASE_URL, BASE_URL } from "../../constants/Config";

const { width } = Dimensions.get("window");

const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/600";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/${imagePath}`;
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

interface ProductDetail {
    id: number | string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    isNew: boolean;
    description: string;
    features: string[];
    colors: string[];
}

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            const data = await response.json();

            if (data.success) {
                const item = data.data;
                setProduct({
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    rating: item.ratings?.average || 0,
                    reviews: item.ratings?.count || 0,
                    image: item.images && item.images.length > 0 ? item.images[0] : "",
                    category: item.category,
                    isNew: item.isFeatured || false,
                    description: item.description,
                    // Mock features and colors as they are not in backend schema yet
                    features: [
                        "High Quality Material",
                        "Durable Construction",
                        "Warranty Included",
                        "Fast Shipping",
                        "Satisfaction Guaranteed"
                    ],
                    colors: ["#1a1a2e", "#e94560", "#f5f5f5"],
                });
            } else {
                Alert.alert("Error", "Product not found");
                router.back();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to load product details");
        } finally {
            setLoading(false);
        }
    };

    const incrementQuantity = () => setQuantity((q) => q + 1);
    const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#e94560" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Product not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? "#e94560" : "#fff"}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: getImageUrl(product.image) }} style={styles.productImage} />
                    {product.isNew && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.categoryRow}>
                        <Text style={styles.category}>{product.category}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{product.rating}</Text>
                            <Text style={styles.reviewsText}>({product.reviews} reviews)</Text>
                        </View>
                    </View>

                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    {/* Colors */}
                    <Text style={styles.sectionTitle}>Colors</Text>
                    <View style={styles.colorsContainer}>
                        {product.colors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.colorButton,
                                    { backgroundColor: color },
                                    selectedColor === index && styles.colorButtonSelected,
                                ]}
                                onPress={() => setSelectedColor(index)}
                            >
                                {selectedColor === index && (
                                    <Ionicons
                                        name="checkmark"
                                        size={16}
                                        color={color === "#ffffff" || color === "#f5f5f5" ? "#1a1a2e" : "#fff"}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Features */}
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.featuresContainer}>
                        {product.features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#e94560" />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Quantity */}
                    <Text style={styles.sectionTitle}>Quantity</Text>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={decrementQuantity}
                        >
                            <Ionicons name="remove" size={20} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={incrementQuantity}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalPrice}>
                        {formatPrice(product.price * quantity)}
                    </Text>
                </View>
                <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8}>
                    <LinearGradient
                        colors={["#e94560", "#c73659"]}
                        style={styles.addToCartGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons
                            name="bag-add"
                            size={20}
                            color="#fff"
                            style={styles.cartIcon}
                        />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f1a",
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        zIndex: 10,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 120,
    },
    imageContainer: {
        width: width,
        height: width * 0.9,
        backgroundColor: "#1a1a2e",
        position: "relative",
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    newBadge: {
        position: "absolute",
        bottom: 20,
        left: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "#e94560",
    },
    newBadgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.5,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: "#0f0f1a",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
    },
    categoryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    category: {
        fontSize: 13,
        color: "#8b8b9e",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 6,
    },
    reviewsText: {
        fontSize: 13,
        color: "#8b8b9e",
        marginLeft: 4,
    },
    productName: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.3,
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: "700",
        color: "#e94560",
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        fontSize: 15,
        color: "#8b8b9e",
        lineHeight: 24,
        marginBottom: 16,
    },
    colorsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 16,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorButtonSelected: {
        borderColor: "#e94560",
    },
    featuresContainer: {
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    featureText: {
        fontSize: 15,
        color: "#fff",
        marginLeft: 12,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    quantityButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    quantityText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#fff",
        marginHorizontal: 24,
        minWidth: 30,
        textAlign: "center",
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 32,
        backgroundColor: "#16213e",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 13,
        color: "#8b8b9e",
        marginBottom: 4,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
    },
    addToCartBtn: {
        flex: 1.2,
        height: 54,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#e94560",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    addToCartGradient: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    cartIcon: {
        marginRight: 8,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        letterSpacing: 0.3,
    },
    errorText: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#e94560",
        borderRadius: 12,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    }
});
