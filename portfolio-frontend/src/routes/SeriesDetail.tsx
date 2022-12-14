import {
  Avatar,
  Box,
  Button,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Img,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  countPlayCount,
  getSeriesDetail,
  getSeriesReviews,
  reviewPost,
} from "../api";
import useUser from "../lib/useUser";
import { IReview, ISeriesDetail } from "../types";

export interface IReviewVariables {
  text: string;
  rating: number;
}

export default function SeriesDetail() {
  const { seriesPk } = useParams();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { register, handleSubmit } = useForm();
  const countMutation = useMutation(countPlayCount, {
    onSuccess: () => {
      console.log("count");
    },
  });
  const { data } = useQuery<ISeriesDetail>(
    ["series", seriesPk],
    getSeriesDetail
  );
  const { data: reviewData } = useQuery<IReview[]>(
    ["series", seriesPk, "reviews"],
    getSeriesReviews
  );
  const playButtonOnClick = () => {
    const videoPk = data?.video[0].pk;
    countMutation.mutate({ videoPk });
  };
  const reviewMutation = useMutation(reviewPost, {
    onSuccess: () => {
      console.log("good");
      queryClient.refetchQueries(["series", seriesPk, "reviews"]);
    },
  });
  const reviewConfirm = ({ text, rating }: IReviewVariables) => {
    const seriesPkVariable = seriesPk as string;
    reviewMutation.mutate({ seriesPkVariable, text, rating });
  };
  return (
    <>
      <Box h="800px" m="0px" backgroundColor="black"></Box>
      <Box top="56px" left="230px" w="1690px" position="absolute">
        <Box m="50px">
          <HStack>
            <Img
              w="190"
              h="280"
              backgroundColor="gray"
              src={data?.poster_url}
            />
            <Box>
              <Heading color="white">{data?.title}</Heading>
              <HStack>
                <Text color="whitesmoke">{data?.genre.genre_name}</Text>
                <Text color="whitesmoke">{data?.video[0].runtime}???</Text>
                <Text color="whitesmoke">|</Text>
                <Text color="whitesmoke">{data?.possible_age}</Text>
              </HStack>
              <Text color="whitesmoke" w="700px">
                {data?.summary}
              </Text>
            </Box>
          </HStack>
          <Box h="56px" borderTop="1px" borderBottom="1px">
            <HStack>
              {user?.coupon.kind_name === "Premium" ? (
                <Button onClick={playButtonOnClick}>????????????</Button>
              ) : null}
              <Box w="90%"></Box>
            </HStack>
          </Box>
          <Tabs color="black" colorScheme="whiteAlpha" align="center">
            <TabList>
              <Tab color={"white"}>????????? ??????</Tab>
              <Tab color={"white"}>?????? ??????</Tab>
            </TabList>
            <TabPanels color="white">
              <TabPanel textAlign="left">
                <Box>
                  <Heading mb="10px">??????/??????</Heading>
                  {data?.actor.map((actors, index) => (
                    <HStack gap="3">
                      <Avatar m="5px" />
                      <Box key={index}>{actors.actor_name}</Box>
                    </HStack>
                  ))}
                </Box>
                <Heading mt="20px" mb="10px">
                  ?????????
                </Heading>
                <HStack>
                  <HStack>
                    <FormLabel w="55px">?????? :</FormLabel>
                    <Input {...register("text")}></Input>
                  </HStack>
                  <HStack>
                    <FormLabel w="50px">?????? :</FormLabel>
                    <Input {...register("rating")} w="50px"></Input>
                  </HStack>
                  <Button
                    color="black"
                    onClick={handleSubmit(({ text, rating }) => {
                      reviewConfirm({ text, rating });
                    })}
                  >
                    ??????
                  </Button>
                </HStack>
                {reviewData?.map((review, index) => (
                  <Grid
                    w="200px"
                    gap="4"
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(5, 1fr)"
                  >
                    <GridItem rowSpan={2} colSpan={1}>
                      <Avatar />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text>{review.user.name}</Text>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <HStack>
                        <FaStar />
                        <Text>{review.rating}</Text>
                      </HStack>
                    </GridItem>
                    <GridItem colSpan={4}>
                      <Text>{review.text}</Text>
                    </GridItem>
                  </Grid>
                ))}
              </TabPanel>
              <TabPanel textAlign="left">
                {data?.video.map((episodes, index) => (
                  <Grid
                    templateRows="repeat(2, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                  >
                    <GridItem colSpan={1} rowSpan={2}>
                      <Image src={episodes.thumbnail_url} />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text>{episodes.sub_title}</Text>
                    </GridItem>
                    <GridItem colSpan={2}>
                      <Text>{episodes.runtime}</Text>
                    </GridItem>
                  </Grid>
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </>
  );
}
